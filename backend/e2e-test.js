/**
 * FleetFlow — Full Lifecycle E2E Test
 * Run with: node e2e-test.js
 * Backend must be running on port 5000.
 */

const http = require('http');

const BASE = 'http://localhost:5000/api';

function request(method, path, body) {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : null;
        const options = {
            hostname: 'localhost',
            port: 5000,
            path,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
            },
        };
        const req = http.request(options, (res) => {
            let raw = '';
            res.on('data', (c) => (raw += c));
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(raw) });
                } catch {
                    resolve({ status: res.statusCode, body: raw });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

function pass(label, detail = '') { console.log(`  ✅ ${label}${detail ? ' — ' + detail : ''}`); }
function fail(label, detail = '') { console.log(`  ❌ ${label}${detail ? ' — ' + detail : ''}`); }
function section(title) { console.log(`\n=== ${title} ===`); }

async function run() {
    let vehicleId, driverId, tripId;
    const results = { backend: true, persistence: true, lifecycle: true, analytics: true };

    // ─── STEP 1: Backend Health ───────────────────────────────────────────────
    section('STEP 1 — Backend Health');
    try {
        const r = await request('GET', '/api/dashboard');
        if (r.status === 200 || r.status === 401) {
            pass('Server reachable on port 5000', `HTTP ${r.status}`);
        } else {
            fail('Dashboard route unexpected status', `HTTP ${r.status}`);
            results.backend = false;
        }
    } catch (e) {
        fail('Cannot reach server on port 5000', e.message);
        results.backend = false;
        console.log('\nABORTED — backend not running.');
        process.exit(1);
    }

    // ─── STEP 2: CRUD Data Flow ───────────────────────────────────────────────
    section('STEP 2 — CRUD Persistence');

    // POST /api/vehicles
    const vh = await request('POST', '/api/vehicles', {
        model: 'Scania R500',
        licensePlate: `TEST-${Date.now()}`,
        maxCapacity: 20000,
        status: 'Available',
        odometer: 0,
    });
    if (vh.status === 201 && vh.body._id) {
        vehicleId = vh.body._id;
        pass('POST /api/vehicles', `id=${vehicleId}`);
    } else {
        fail('POST /api/vehicles', `HTTP ${vh.status} — ${JSON.stringify(vh.body)}`);
        results.persistence = false;
    }

    // POST /api/drivers
    const dr = await request('POST', '/api/drivers', {
        name: 'E2E Test Driver',
        licenseNumber: `LIC-${Date.now()}`,
        expiryDate: '2027-12-31',
        status: 'On Duty',
        safetyScore: 95,
    });
    if (dr.status === 201 && dr.body._id) {
        driverId = dr.body._id;
        pass('POST /api/drivers', `id=${driverId}`);
    } else {
        fail('POST /api/drivers', `HTTP ${dr.status} — ${JSON.stringify(dr.body)}`);
        results.persistence = false;
    }

    // POST /api/trips (Draft)
    const tr = await request('POST', '/api/trips', {
        vehicleId,
        driverId,
        origin: 'Mumbai Hub',
        destination: 'Pune Depot',
        cargoWeight: 8000,
        startOdometer: 0,
    });
    if ((tr.status === 201 || tr.status === 200) && tr.body._id) {
        tripId = tr.body._id;
        pass('POST /api/trips', `id=${tripId}, status=${tr.body.status}`);
    } else {
        fail('POST /api/trips', `HTTP ${tr.status} — ${JSON.stringify(tr.body)}`);
        results.persistence = false;
    }

    // ─── STEP 3: Trip Lifecycle Engine ────────────────────────────────────────
    section('STEP 3 — Trip Lifecycle Engine');

    if (vehicleId && driverId) {
        // POST /api/trips/dispatch (trips.js handler — creates new dispatch record)
        const disp = await request('POST', '/api/trips/dispatch', {
            vehicleId,
            driverId,
            cargoWeight: 8000,
        });
        const dispatchedTripId = disp.body?.trip?._id;
        if (disp.status === 201 && dispatchedTripId) {
            pass('POST /api/trips/dispatch', `trip=${dispatchedTripId}, vehicle=${disp.body.vehicle?.status}`);
        } else {
            fail('POST /api/trips/dispatch', `HTTP ${disp.status} — ${JSON.stringify(disp.body)}`);
            results.lifecycle = false;
        }

        // POST /api/trips/complete — needs tripId from dispatch
        const comp = await request('POST', '/api/trips/complete', {
            tripId: dispatchedTripId,
            vehicleId,
            driverId,
            startOdometer: 0,
            endOdometer: 350,
        });
        if (comp.status === 200 && comp.body.metrics) {
            pass(
                'POST /api/trips/complete',
                `distance=${comp.body.metrics?.distanceTravelled}km, status=${comp.body.trip?.status}`
            );
        } else {
            fail('POST /api/trips/complete', `HTTP ${comp.status} — ${JSON.stringify(comp.body)}`);
            results.lifecycle = false;
        }
    } else {
        fail('Skipping lifecycle — vehicle or driver ID missing from CRUD step');
        results.lifecycle = false;
    }

    // ─── STEP 4: Analytics Aggregation ────────────────────────────────────────
    section('STEP 4 — Analytics Aggregation');

    for (const endpoint of ['/fuel-trend', '/maintenance-trend', '/top-vehicles', '/monthly-summary']) {
        const r = await request('GET', `/api/analytics${endpoint}`);
        if (r.status === 200) {
            const isArr = Array.isArray(r.body);
            pass(`GET /api/analytics${endpoint}`, `${isArr ? r.body.length + ' records' : typeof r.body}`);
        } else {
            fail(`GET /api/analytics${endpoint}`, `HTTP ${r.status} — ${JSON.stringify(r.body)}`);
            results.analytics = false;
        }
    }

    // ─── STEP 5: GET Listings ─────────────────────────────────────────────────
    section('STEP 5 — GET Listings');

    for (const [label, path] of [
        ['GET /api/vehicles', '/api/vehicles'],
        ['GET /api/drivers', '/api/drivers'],
        ['GET /api/trips', '/api/trips'],
    ]) {
        const r = await request('GET', path);
        if (r.status === 200) {
            const count = Array.isArray(r.body) ? r.body.length : '?';
            pass(label, `${count} records`);
        } else {
            fail(label, `HTTP ${r.status}`);
        }
    }

    // ─── FINAL REPORT ─────────────────────────────────────────────────────────
    section('FINAL AUDIT REPORT');
    console.log(`  Backend Health:         ${results.backend ? '✅ OK' : '❌ Issues found'}`);
    console.log(`  MongoDB Persistence:    ${results.persistence ? '✅ OK' : '❌ Issues found'}`);
    console.log(`  Trip Lifecycle Engine:  ${results.lifecycle ? '✅ OK' : '❌ Issues found'}`);
    console.log(`  Analytics Aggregation:  ${results.analytics ? '✅ OK' : '❌ Issues found'}`);

    const allOk = Object.values(results).every(Boolean);
    console.log(`\n  Overall System Status: ${allOk ? '🚀 READY FOR DEMO' : '⚠️  NEEDS ATTENTION'}\n`);
}

run().catch((err) => {
    console.error('Unhandled error in test runner:', err);
    process.exit(1);
});
