/**
 * Comprehensive API Endpoint Test Script
 * Tests all backend API endpoints
 */
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });
const http = require('http');
const fs = require('fs');

const BASE_URL = 'http://localhost:5001';

// ---------- HTTP helpers ----------
function request(method, urlPath, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(urlPath, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(data) });
                } catch {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

function uploadFile(urlPath, fields, filePath, token) {
    return new Promise((resolve, reject) => {
        const boundary = '----TestBoundary' + Date.now();
        const url = new URL(urlPath, BASE_URL);

        let body = '';
        for (const [key, val] of Object.entries(fields)) {
            body += `--${boundary}\r\n`;
            body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
            body += `${val}\r\n`;
        }

        const fileContent = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);
        body += `--${boundary}\r\n`;
        body += `Content-Disposition: form-data; name="document"; filename="${fileName}"\r\n`;
        body += `Content-Type: application/pdf\r\n\r\n`;

        const bodyStart = Buffer.from(body, 'utf-8');
        const bodyEnd = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');
        const fullBody = Buffer.concat([bodyStart, fileContent, bodyEnd]);

        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': fullBody.length,
                'Authorization': `Bearer ${token}`,
            },
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(data) });
                } catch {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });
        req.on('error', reject);
        req.write(fullBody);
        req.end();
    });
}

// ---------- Logger ----------
const results = [];
function log(testName, method, path, status, success, details = '') {
    const icon = success ? '✅' : '❌';
    console.log(`${icon} ${testName} — ${method} ${path} → ${status} ${details}`);
    results.push({ testName, method, path, status, success, details });
}

// ---------- Main ----------
async function main() {
    // 1. Connect to MongoDB Atlas
    console.log('\n🔧 Connecting to MongoDB Atlas...');
    process.env.PORT = '5001';

    // 2. Start Express server
    console.log('🚀 Starting Express server on port 5001...');
    const connectDB = require('./config/db');
    await connectDB();

    const express = require('express');
    const cors = require('cors');
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/uploads', express.static('uploads'));
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/applications', require('./routes/applications'));
    app.use('/api/documents', require('./routes/documents'));
    app.get('/', (req, res) => res.json({ message: 'Government Recruitment Portal API' }));

    const server = app.listen(5001, () => console.log('   Server ready on port 5001\n'));

    // Wait a bit for server to be ready
    await new Promise((r) => setTimeout(r, 500));

    // Drop stale indexes and clean up leftover test data
    const mongoose = require('mongoose');
    const UserModel = require('./models/User');
    const ApplicationModel = require('./models/Application');
    const DocumentModel = require('./models/Document');
    try {
        await mongoose.connection.collection('users').dropIndex('username_1');
        console.log('   🗑️  Dropped stale username_1 index');
    } catch (e) {
        // Index might not exist, that's fine
    }
    // Clean up any leftover test data from previous runs
    await UserModel.deleteMany({ email: { $in: ['testuser@test.com', 'admin@test.com'] } });
    await ApplicationModel.deleteMany({ position: { $in: ['Scientist B', 'Tech Officer'] } });
    console.log('   🧹 Cleaned up leftover test data\n');

    // Create a dummy PDF file for upload tests
    const dummyPdfPath = path.join(__dirname, 'uploads', 'test_dummy.pdf');
    fs.writeFileSync(dummyPdfPath, '%PDF-1.4 dummy test file content');

    let userToken = '';
    let adminToken = '';
    let userId = '';
    let adminId = '';
    let applicationId = '';
    let applicationMongoId = '';
    let documentId = '';

    console.log('═══════════════════════════════════════════════════');
    console.log('              API ENDPOINT TEST RESULTS            ');
    console.log('═══════════════════════════════════════════════════\n');

    // ====== AUTH ROUTES ======
    console.log('── Auth Routes (/api/auth) ──────────────────────\n');

    // Test 1: Health check
    try {
        const res = await request('GET', '/');
        log('Health Check', 'GET', '/', res.status, res.status === 200 && res.body.message === 'Government Recruitment Portal API');
    } catch (e) {
        log('Health Check', 'GET', '/', 0, false, e.message);
    }

    // Test 2: Register - missing fields
    try {
        const res = await request('POST', '/api/auth/register', { name: 'Test' });
        log('Register (missing fields)', 'POST', '/api/auth/register', res.status, res.status === 400, res.body.message);
    } catch (e) {
        log('Register (missing fields)', 'POST', '/api/auth/register', 0, false, e.message);
    }

    // Test 3: Register user
    try {
        const res = await request('POST', '/api/auth/register', {
            name: 'Test User',
            email: 'testuser@test.com',
            password: 'password123',
            phone: '9876543210',
        });
        log('Register User', 'POST', '/api/auth/register', res.status, res.status === 201 && res.body.success);
        if (res.body.success) {
            userToken = res.body.data.token;
            userId = res.body.data.id;
        }
    } catch (e) {
        log('Register User', 'POST', '/api/auth/register', 0, false, e.message);
    }

    // Test 4: Register duplicate
    try {
        const res = await request('POST', '/api/auth/register', {
            name: 'Test User',
            email: 'testuser@test.com',
            password: 'password123',
            phone: '9876543210',
        });
        log('Register (duplicate email)', 'POST', '/api/auth/register', res.status, res.status === 400, res.body.message);
    } catch (e) {
        log('Register (duplicate email)', 'POST', '/api/auth/register', 0, false, e.message);
    }

    // Test 5: Register admin (for later tests)
    try {
        // Directly create admin via model since route forces role='user'
        const admin = await UserModel.create({
            name: 'Admin User',
            email: 'admin@test.com',
            password: 'admin123',
            phone: '9876543211',
            role: 'admin',
        });
        // Login to get token
        const res = await request('POST', '/api/auth/login', {
            email: 'admin@test.com',
            password: 'admin123',
        });
        log('Admin Login', 'POST', '/api/auth/login', res.status, res.status === 200 && res.body.data.role === 'admin');
        if (res.body.success) {
            adminToken = res.body.data.token;
            adminId = res.body.data.id;
        }
    } catch (e) {
        log('Admin Login', 'POST', '/api/auth/login', 0, false, e.message);
    }

    // Test 6: Login - missing fields
    try {
        const res = await request('POST', '/api/auth/login', { email: 'testuser@test.com' });
        log('Login (missing password)', 'POST', '/api/auth/login', res.status, res.status === 400, res.body.message);
    } catch (e) {
        log('Login (missing password)', 'POST', '/api/auth/login', 0, false, e.message);
    }

    // Test 7: Login - wrong password
    try {
        const res = await request('POST', '/api/auth/login', { email: 'testuser@test.com', password: 'wrongpass' });
        log('Login (wrong password)', 'POST', '/api/auth/login', res.status, res.status === 401, res.body.message);
    } catch (e) {
        log('Login (wrong password)', 'POST', '/api/auth/login', 0, false, e.message);
    }

    // Test 8: Login - valid
    try {
        const res = await request('POST', '/api/auth/login', { email: 'testuser@test.com', password: 'password123' });
        log('Login (valid)', 'POST', '/api/auth/login', res.status, res.status === 200 && res.body.success);
    } catch (e) {
        log('Login (valid)', 'POST', '/api/auth/login', 0, false, e.message);
    }

    // Test 9: Get Me - no token
    try {
        const res = await request('GET', '/api/auth/me');
        log('Get Me (no token)', 'GET', '/api/auth/me', res.status, res.status === 401, res.body.message);
    } catch (e) {
        log('Get Me (no token)', 'GET', '/api/auth/me', 0, false, e.message);
    }

    // Test 10: Get Me - valid token
    try {
        const res = await request('GET', '/api/auth/me', null, userToken);
        log('Get Me (valid token)', 'GET', '/api/auth/me', res.status, res.status === 200 && res.body.data.email === 'testuser@test.com');
    } catch (e) {
        log('Get Me (valid token)', 'GET', '/api/auth/me', 0, false, e.message);
    }

    // ====== APPLICATION ROUTES ======
    console.log('\n── Application Routes (/api/applications) ─────────\n');

    // Test 11: Create application (no token)
    try {
        const res = await request('POST', '/api/applications', { position: 'Scientist B' });
        log('Create App (no token)', 'POST', '/api/applications', res.status, res.status === 401);
    } catch (e) {
        log('Create App (no token)', 'POST', '/api/applications', 0, false, e.message);
    }

    // Test 12: Create application
    try {
        const res = await request('POST', '/api/applications', { position: 'Scientist B' }, userToken);
        log('Create Application', 'POST', '/api/applications', res.status, res.status === 201 && res.body.success);
        if (res.body.success) {
            applicationMongoId = res.body.data._id;
            applicationId = res.body.data.applicationId;
        }
    } catch (e) {
        log('Create Application', 'POST', '/api/applications', 0, false, e.message);
    }

    // Test 13: Get all applications (user)
    try {
        const res = await request('GET', '/api/applications', null, userToken);
        log('Get My Applications (user)', 'GET', '/api/applications', res.status, res.status === 200 && res.body.count >= 1);
    } catch (e) {
        log('Get My Applications (user)', 'GET', '/api/applications', 0, false, e.message);
    }

    // Test 14: Get all applications (admin)
    try {
        const res = await request('GET', '/api/applications', null, adminToken);
        log('Get All Applications (admin)', 'GET', '/api/applications', res.status, res.status === 200 && res.body.count >= 1);
    } catch (e) {
        log('Get All Applications (admin)', 'GET', '/api/applications', 0, false, e.message);
    }

    // Test 15: Get single application
    try {
        const res = await request('GET', `/api/applications/${applicationMongoId}`, null, userToken);
        log('Get Single Application', 'GET', '/api/applications/:id', res.status, res.status === 200 && res.body.success);
    } catch (e) {
        log('Get Single Application', 'GET', '/api/applications/:id', 0, false, e.message);
    }

    // Test 16: Update application (admin)
    try {
        const res = await request('PUT', `/api/applications/${applicationMongoId}`, { status: 'in-progress' }, adminToken);
        log('Update Application (admin)', 'PUT', '/api/applications/:id', res.status, res.status === 200 && res.body.success);
    } catch (e) {
        log('Update Application (admin)', 'PUT', '/api/applications/:id', 0, false, e.message);
    }

    // Test 17: Update application (user - should be forbidden)
    try {
        const res = await request('PUT', `/api/applications/${applicationMongoId}`, { status: 'completed' }, userToken);
        log('Update Application (user - forbidden)', 'PUT', '/api/applications/:id', res.status, res.status === 403);
    } catch (e) {
        log('Update Application (user - forbidden)', 'PUT', '/api/applications/:id', 0, false, e.message);
    }

    // Test 18: Update application stage (admin)
    try {
        const res = await request(
            'PUT',
            `/api/applications/${applicationMongoId}/stage`,
            { currentStage: 'Document Verification', stageStatus: 'in-progress' },
            adminToken
        );
        log('Update App Stage (admin)', 'PUT', '/api/applications/:id/stage', res.status, res.status === 200 && res.body.success);
    } catch (e) {
        log('Update App Stage (admin)', 'PUT', '/api/applications/:id/stage', 0, false, e.message);
    }

    // ====== DOCUMENT ROUTES ======
    console.log('\n── Document Routes (/api/documents) ────────────────\n');

    // Test 19: Upload document
    try {
        const res = await uploadFile(
            '/api/documents/upload',
            { applicationId: applicationMongoId, documentType: 'Birth Certificate' },
            dummyPdfPath,
            userToken
        );
        log('Upload Document', 'POST', '/api/documents/upload', res.status, res.status === 201 && res.body.success);
        if (res.body.success) {
            documentId = res.body.data._id;
        }
    } catch (e) {
        log('Upload Document', 'POST', '/api/documents/upload', 0, false, e.message);
    }

    // Test 20: Get documents for application
    try {
        const res = await request('GET', `/api/documents/application/${applicationMongoId}`, null, userToken);
        log('Get Application Documents', 'GET', '/api/documents/application/:appId', res.status, res.status === 200 && res.body.count >= 1);
    } catch (e) {
        log('Get Application Documents', 'GET', '/api/documents/application/:appId', 0, false, e.message);
    }

    // Test 21: Verify document (admin)
    if (documentId) {
        try {
            const res = await request('PUT', `/api/documents/${documentId}/verify`, {}, adminToken);
            log('Verify Document (admin)', 'PUT', '/api/documents/:id/verify', res.status, res.status === 200 && res.body.data.verified === true);
        } catch (e) {
            log('Verify Document (admin)', 'PUT', '/api/documents/:id/verify', 0, false, e.message);
        }
    }

    // Test 22: Verify document (user - forbidden)
    if (documentId) {
        try {
            const res = await request('PUT', `/api/documents/${documentId}/verify`, {}, userToken);
            log('Verify Document (user - forbidden)', 'PUT', '/api/documents/:id/verify', res.status, res.status === 403);
        } catch (e) {
            log('Verify Document (user - forbidden)', 'PUT', '/api/documents/:id/verify', 0, false, e.message);
        }
    }

    // Test 23: Delete document (user - owner)
    if (documentId) {
        try {
            const res = await request('DELETE', `/api/documents/${documentId}`, null, userToken);
            log('Delete Document (owner)', 'DELETE', '/api/documents/:id', res.status, res.status === 200 && res.body.success);
        } catch (e) {
            log('Delete Document (owner)', 'DELETE', '/api/documents/:id', 0, false, e.message);
        }
    }

    // Test 24: Delete application (admin)
    try {
        const res = await request('DELETE', `/api/applications/${applicationMongoId}`, null, adminToken);
        log('Delete Application (admin)', 'DELETE', '/api/applications/:id', res.status, res.status === 200 && res.body.success);
    } catch (e) {
        log('Delete Application (admin)', 'DELETE', '/api/applications/:id', 0, false, e.message);
    }

    // Test 25: Delete application (user - forbidden)
    try {
        // Create a new application first
        const createRes = await request('POST', '/api/applications', { position: 'Tech Officer' }, userToken);
        if (createRes.body.success) {
            const res = await request('DELETE', `/api/applications/${createRes.body.data._id}`, null, userToken);
            log('Delete Application (user - forbidden)', 'DELETE', '/api/applications/:id', res.status, res.status === 403);
        }
    } catch (e) {
        log('Delete Application (user - forbidden)', 'DELETE', '/api/applications/:id', 0, false, e.message);
    }

    // ====== SUMMARY ======
    console.log('\n═══════════════════════════════════════════════════');
    console.log('                   TEST SUMMARY                    ');
    console.log('═══════════════════════════════════════════════════\n');

    const passed = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;
    const total = results.length;

    console.log(`   Total Tests:  ${total}`);
    console.log(`   ✅ Passed:    ${passed}`);
    console.log(`   ❌ Failed:    ${failed}`);
    console.log(`   Pass Rate:    ${((passed / total) * 100).toFixed(1)}%`);
    console.log('');

    if (failed > 0) {
        console.log('   Failed Tests:');
        results.filter((r) => !r.success).forEach((r) => {
            console.log(`     ❌ ${r.testName} — ${r.method} ${r.path} → ${r.status} ${r.details}`);
        });
        console.log('');
    }

    // Clean up
    fs.unlinkSync(dummyPdfPath);
    // Clean up test data from Atlas
    await UserModel.deleteMany({ email: { $in: ['testuser@test.com', 'admin@test.com'] } });
    await ApplicationModel.deleteMany({ position: { $in: ['Scientist B', 'Tech Officer'] } });
    server.close();
    await mongoose.disconnect();
    console.log('🧹 Cleanup complete.\n');
}

main().catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
});
