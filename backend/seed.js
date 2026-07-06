const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Classroom = require('./models/Classroom');
const Subject = require('./models/Subject');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Classroom.deleteMany({});
    await Subject.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin',
      phone: '1234567890',
      department: 'Administration'
    });
    console.log('✓ Admin created');

    // Create Teachers
    const teacher1 = await User.create({
      name: 'John Smith',
      email: 'john@test.com',
      password: 'teacher123',
      role: 'teacher',
      phone: '1234567891',
      department: 'Computer Science'
    });

    const teacher2 = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah@test.com',
      password: 'teacher123',
      role: 'teacher',
      phone: '1234567892',
      department: 'Mathematics'
    });

    const teacher3 = await User.create({
      name: 'Mike Wilson',
      email: 'mike@test.com',
      password: 'teacher123',
      role: 'teacher',
      phone: '1234567893',
      department: 'Physics'
    });
    console.log('✓ Teachers created');

    // Create Students
    const students = [];
    for (let i = 1; i <= 10; i++) {
      const student = await User.create({
        name: `Student ${i}`,
        email: `student${i}@test.com`,
        password: 'student123',
        role: 'student',
        phone: `123456789${i}`,
        class: 'CS-A',
        rollNumber: `CS00${i}`
      });
      students.push(student);
    }
    console.log('✓ Students created');

    // Create Classrooms
    const classrooms = await Classroom.insertMany([
      { name: 'Lab 1', roomNumber: 'L101', capacity: 30, building: 'A', floor: '1', facilities: ['Projector', 'AC', 'Computers'] },
      { name: 'Lab 2', roomNumber: 'L102', capacity: 30, building: 'A', floor: '1', facilities: ['Projector', 'AC', 'Computers'] },
      { name: 'Classroom 1', roomNumber: 'C201', capacity: 50, building: 'B', floor: '2', facilities: ['Projector', 'AC', 'Whiteboard'] },
      { name: 'Classroom 2', roomNumber: 'C202', capacity: 50, building: 'B', floor: '2', facilities: ['Projector', 'AC', 'Whiteboard'] },
      { name: 'Lecture Hall', roomNumber: 'LH301', capacity: 100, building: 'C', floor: '3', facilities: ['Projector', 'AC', 'Audio System'] }
    ]);
    console.log('✓ Classrooms created');

    // Create Subjects
    const subjects = await Subject.insertMany([
      { name: 'Data Structures', code: 'CS101', department: 'Computer Science', semester: 3, credits: 4, teacher: teacher1._id, class: 'CS-A' },
      { name: 'Algorithms', code: 'CS102', department: 'Computer Science', semester: 3, credits: 4, teacher: teacher1._id, class: 'CS-A' },
      { name: 'Database Systems', code: 'CS103', department: 'Computer Science', semester: 3, credits: 3, teacher: teacher1._id, class: 'CS-A' },
      { name: 'Linear Algebra', code: 'MA101', department: 'Mathematics', semester: 3, credits: 3, teacher: teacher2._id, class: 'CS-A' },
      { name: 'Calculus', code: 'MA102', department: 'Mathematics', semester: 3, credits: 4, teacher: teacher2._id, class: 'CS-A' },
      { name: 'Physics', code: 'PH101', department: 'Physics', semester: 3, credits: 3, teacher: teacher3._id, class: 'CS-A' }
    ]);
    console.log('✓ Subjects created');

    console.log('\n========================================');
    console.log('✅ Database seeded successfully!');
    console.log('========================================');
    console.log('\nTest Credentials:');
    console.log('\nAdmin:');
    console.log('  Email: admin@test.com');
    console.log('  Password: admin123');
    console.log('\nTeacher:');
    console.log('  Email: john@test.com');
    console.log('  Password: teacher123');
    console.log('\nStudent:');
    console.log('  Email: student1@test.com');
    console.log('  Password: student123');
    console.log('\n========================================');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run seeder
connectDB().then(() => {
  seedData();
});
