import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database initialization
let db;
const initializeDB = async () => {
  try {
    db = await open({
      filename: path.join(__dirname, 'database.sqlite'),
      driver: sqlite3.Database
    });
    
    // Create tables if they don't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('viewer', 'student', 'faculty', 'admin', 'management')),
        firstName TEXT,
        lastName TEXT,
        profileImage TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS team_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        teamId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        role TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teamId) REFERENCES teams (id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE (teamId, userId)
      );
      
      CREATE TABLE IF NOT EXISTS sdgs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        number INTEGER NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        iconPath TEXT,
        color TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        thumbnailUrl TEXT NOT NULL,
        repositoryUrl TEXT,
        demoUrl TEXT,
        teamId INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teamId) REFERENCES teams (id) ON DELETE CASCADE
      );
      
      CREATE TABLE IF NOT EXISTS project_sdgs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        projectId INTEGER NOT NULL,
        sdgId INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (projectId) REFERENCES projects (id) ON DELETE CASCADE,
        FOREIGN KEY (sdgId) REFERENCES sdgs (id) ON DELETE CASCADE,
        UNIQUE (projectId, sdgId)
      );
      
      CREATE TABLE IF NOT EXISTS project_media (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        projectId INTEGER NOT NULL,
        mediaUrl TEXT NOT NULL,
        mediaType TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (projectId) REFERENCES projects (id) ON DELETE CASCADE
      );
      
      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        rating INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        projectId INTEGER NOT NULL,
        isPrivate BOOLEAN DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (projectId) REFERENCES projects (id) ON DELETE CASCADE
      );
    `);
    
    // Insert SDGs if they don't exist
    const sdgsCount = await db.get('SELECT COUNT(*) as count FROM sdgs');
    
    if (sdgsCount.count === 0) {
      const sdgs = [
        { number: 1, name: 'No Poverty', description: 'End poverty in all its forms everywhere', color: '#E5243B' },
        { number: 2, name: 'Zero Hunger', description: 'End hunger, achieve food security and improved nutrition', color: '#DDA63A' },
        { number: 3, name: 'Good Health', description: 'Ensure healthy lives and promote well-being for all', color: '#4C9F38' },
        { number: 4, name: 'Quality Education', description: 'Ensure inclusive and equitable quality education', color: '#C5192D' },
        { number: 5, name: 'Gender Equality', description: 'Achieve gender equality and empower all women and girls', color: '#FF3A21' },
        { number: 6, name: 'Clean Water', description: 'Ensure access to water and sanitation for all', color: '#26BDE2' },
        { number: 7, name: 'Clean Energy', description: 'Ensure access to affordable, reliable, sustainable energy', color: '#FCC30B' },
        { number: 8, name: 'Good Jobs', description: 'Promote inclusive and sustainable economic growth', color: '#A21942' },
        { number: 9, name: 'Innovation', description: 'Build resilient infrastructure, promote sustainable industrialization', color: '#FD6925' },
        { number: 10, name: 'Reduced Inequalities', description: 'Reduce inequality within and among countries', color: '#DD1367' },
        { number: 11, name: 'Sustainable Cities', description: 'Make cities inclusive, safe, resilient and sustainable', color: '#FD9D24' },
        { number: 12, name: 'Responsible Consumption', description: 'Ensure sustainable consumption and production patterns', color: '#BF8B2E' },
        { number: 13, name: 'Climate Action', description: 'Take urgent action to combat climate change and its impacts', color: '#3F7E44' },
        { number: 14, name: 'Life Below Water', description: 'Conserve and sustainably use the oceans, seas and marine resources', color: '#0A97D9' },
        { number: 15, name: 'Life On Land', description: 'Sustainably manage forests, combat desertification', color: '#56C02B' },
        { number: 16, name: 'Peace & Justice', description: 'Promote just, peaceful and inclusive societies', color: '#00689D' },
        { number: 17, name: 'Partnerships', description: 'Revitalize the global partnership for sustainable development', color: '#19486A' }
      ];
      
      const insertSDGStmt = await db.prepare(
        'INSERT INTO sdgs (number, name, description, color) VALUES (?, ?, ?, ?)'
      );
      
      for (const sdg of sdgs) {
        await insertSDGStmt.run(sdg.number, sdg.name, sdg.description, sdg.color);
      }
      
      await insertSDGStmt.finalize();
    }
    
    // Create admin user if it doesn't exist
    const adminExists = await db.get('SELECT * FROM users WHERE email = ?', ['admin@example.com']);
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await db.run(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['admin', 'admin@example.com', hashedPassword, 'admin']
      );
    }
    
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  }
};

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes
// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await db.get(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Validate role
    const validRoles = ['viewer', 'student', 'faculty', 'admin', 'management'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const result = await db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );
    
    // Get created user
    const user = await db.get('SELECT id, username, email, role FROM users WHERE id = ?', [result.lastID]);
    
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.get(
      'SELECT id, username, email, role, firstName, lastName, profileImage, createdAt, updatedAt FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// SDG Routes
app.get('/api/sdgs', async (req, res) => {
  try {
    const sdgs = await db.all('SELECT * FROM sdgs ORDER BY number');
    res.json(sdgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Projects Routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await db.all(`
      SELECT 
        p.id, p.title, p.description, p.thumbnailUrl, p.repositoryUrl, p.demoUrl, 
        p.teamId, p.createdAt, p.updatedAt,
        AVG(f.rating) as averageRating
      FROM projects p
      LEFT JOIN feedback f ON p.id = f.projectId
      GROUP BY p.id
      ORDER BY p.createdAt DESC
    `);
    
    // Get SDGs for each project
    for (const project of projects) {
      const sdgs = await db.all(`
        SELECT s.*
        FROM sdgs s
        JOIN project_sdgs ps ON s.id = ps.sdgId
        WHERE ps.projectId = ?
      `, [project.id]);
      
      const media = await db.all(`
        SELECT mediaUrl
        FROM project_media
        WHERE projectId = ?
      `, [project.id]);
      
      project.sdgs = sdgs;
      project.mediaUrls = media.map(m => m.mediaUrl);
    }
    
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await db.get(`
      SELECT 
        p.id, p.title, p.description, p.thumbnailUrl, p.repositoryUrl, p.demoUrl, 
        p.teamId, p.createdAt, p.updatedAt,
        AVG(f.rating) as averageRating
      FROM projects p
      LEFT JOIN feedback f ON p.id = f.projectId
      WHERE p.id = ?
      GROUP BY p.id
    `, [req.params.id]);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Get SDGs
    const sdgs = await db.all(`
      SELECT s.*
      FROM sdgs s
      JOIN project_sdgs ps ON s.id = ps.sdgId
      WHERE ps.projectId = ?
    `, [project.id]);
    
    // Get media
    const media = await db.all(`
      SELECT mediaUrl
      FROM project_media
      WHERE projectId = ?
    `, [project.id]);
    
    // Get team
    const team = await db.get('SELECT * FROM teams WHERE id = ?', [project.teamId]);
    
    // Get team members
    const teamMembers = await db.all(`
      SELECT u.id, u.username, u.firstName, u.lastName, u.profileImage, tm.role
      FROM users u
      JOIN team_members tm ON u.id = tm.userId
      WHERE tm.teamId = ?
    `, [team.id]);
    
    // Get feedback
    const feedback = await db.all(`
      SELECT 
        f.id, f.content, f.rating, f.createdAt, f.userId,
        u.username, u.firstName, u.lastName, u.profileImage
      FROM feedback f
      JOIN users u ON f.userId = u.id
      WHERE f.projectId = ? AND f.isPrivate = 0
      ORDER BY f.createdAt DESC
    `, [project.id]);
    
    project.sdgs = sdgs;
    project.mediaUrls = media.map(m => m.mediaUrl);
    project.team = {
      ...team,
      members: teamMembers
    };
    project.feedback = feedback;
    
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route for creating projects
app.post('/api/projects', authenticateToken, async (req, res) => {
  const { title, description, thumbnailUrl, repositoryUrl, demoUrl, teamId, sdgs, mediaUrls } = req.body;
  
  try {
    // Validate user role
    if (!['student', 'faculty', 'admin', 'management'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized to create projects' });
    }
    
    // Create project
    const result = await db.run(
      `INSERT INTO projects 
        (title, description, thumbnailUrl, repositoryUrl, demoUrl, teamId) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, thumbnailUrl, repositoryUrl, demoUrl, teamId]
    );
    
    const projectId = result.lastID;
    
    // Add SDGs
    if (sdgs && sdgs.length > 0) {
      const sdgStatement = await db.prepare(
        'INSERT INTO project_sdgs (projectId, sdgId) VALUES (?, ?)'
      );
      
      for (const sdgId of sdgs) {
        await sdgStatement.run(projectId, sdgId);
      }
      
      await sdgStatement.finalize();
    }
    
    // Add media
    if (mediaUrls && mediaUrls.length > 0) {
      const mediaStatement = await db.prepare(
        'INSERT INTO project_media (projectId, mediaUrl, mediaType) VALUES (?, ?, ?)'
      );
      
      for (const mediaUrl of mediaUrls) {
        // Determine media type based on URL
        const mediaType = mediaUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? 'image' : 'video';
        await mediaStatement.run(projectId, mediaUrl, mediaType);
      }
      
      await mediaStatement.finalize();
    }
    
    // Get the created project
    const project = await db.get('SELECT * FROM projects WHERE id = ?', [projectId]);
    
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Feedback routes
app.post('/api/projects/:id/feedback', authenticateToken, async (req, res) => {
  const { content, rating, isPrivate = false } = req.body;
  const projectId = req.params.id;
  
  try {
    // Validate project exists
    const project = await db.get('SELECT * FROM projects WHERE id = ?', [projectId]);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Create feedback
    const result = await db.run(
      'INSERT INTO feedback (content, rating, userId, projectId, isPrivate) VALUES (?, ?, ?, ?, ?)',
      [content, rating, req.user.id, projectId, isPrivate ? 1 : 0]
    );
    
    const feedback = await db.get('SELECT * FROM feedback WHERE id = ?', [result.lastID]);
    
    res.status(201).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
initializeDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});