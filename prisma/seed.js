const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with rich dummy data...");

  // Clear existing data (optional, but good for a clean seed)
  // Deletions ordered to avoid foreign key violations
  await prisma.payment.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.courseVideo.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.paymentSettings.deleteMany({});

  console.log("Existing data cleared.");

  // 1. Create Hashed Passwords
  const adminPassword = await bcrypt.hash("admin123", 10);
  const teacherPassword = await bcrypt.hash("teacher123", 10);
  const studentPassword = await bcrypt.hash("student123", 10);

  // 2. Create Users
  const admin = await prisma.user.create({
    data: {
      name: "LMS Admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`Created Admin: ${admin.email} (password: admin123)`);

  const teacher = await prisma.user.create({
    data: {
      name: "Professor John Doe",
      email: "teacher@example.com",
      password: teacherPassword,
      role: "TEACHER",
    },
  });
  console.log(`Created Teacher: ${teacher.email} (password: teacher123)`);

  const student = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "student@example.com",
      password: studentPassword,
      role: "STUDENT",
    },
  });
  console.log(`Created Student: ${student.email} (password: student123)`);

  // 3. Create Default Payment Settings
  const paymentSettings = await prisma.paymentSettings.create({
    data: {
      id: "singleton",
      qrCodeImageUrl: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=300&h=300&fit=crop",
      upiId: "lmsplatform@upi",
      instructions: "Please scan the QR code above or pay using the UPI address to complete the course payment. Once paid, copy the transaction reference number from your banking app, upload a screenshot of the receipt, and submit the enrollment form for admin verification.",
    },
  });
  console.log("Created Payment Settings.");

  // 4. Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: "Mastering React & Next.js 14",
      description: "A deep dive into learning Next.js App Router, Tailwind CSS, Prisma, Server Actions, and database state management.",
      price: 4999, // $49.99 in cents
      thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=500&h=280&fit=crop",
      teacherId: teacher.id,
      isPublished: true,
    },
  });
  console.log(`Created Course 1: ${course1.title}`);

  const course2 = await prisma.course.create({
    data: {
      title: "Full-Stack Web Development Bootcamp",
      description: "Learn HTML, CSS, JavaScript, Node.js, Express, SQL, and Git from absolute scratch. Includes multiple portfolio projects.",
      price: 9999, // $99.99 in cents
      thumbnailUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=500&h=280&fit=crop",
      teacherId: teacher.id,
      isPublished: true,
    },
  });
  console.log(`Created Course 2: ${course2.title}`);

  const course3 = await prisma.course.create({
    data: {
      title: "Advanced UI/UX Design & Figma Prototyping",
      description: "Master modern product design, user research, wireframing, component libraries, design systems, and fully interactive high-fidelity prototyping in Figma.",
      price: 3999,
      thumbnailUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=500&h=280&fit=crop",
      teacherId: teacher.id,
      isPublished: true,
    },
  });
  console.log(`Created Course 3: ${course3.title}`);

  const course4 = await prisma.course.create({
    data: {
      title: "Data Science & Machine Learning Bootcamp",
      description: "Learn Python, Pandas, NumPy, Scikit-Learn, data visualization, regression models, neural networks, and deploy machine learning models in production.",
      price: 7999,
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&h=280&fit=crop",
      teacherId: teacher.id,
      isPublished: true,
    },
  });
  console.log(`Created Course 4: ${course4.title}`);

  const course5 = await prisma.course.create({
    data: {
      title: "Digital Marketing Specialist Course",
      description: "Master search engine optimization (SEO), search engine marketing (SEM), Google Analytics 4, email marketing, and running high-ROI social media ads.",
      price: 2999,
      thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&h=280&fit=crop",
      teacherId: teacher.id,
      isPublished: true,
    },
  });
  console.log(`Created Course 5: ${course5.title}`);

  const course6 = await prisma.course.create({
    data: {
      title: "Mobile App Development with React Native",
      description: "Build cross-platform iOS and Android apps using React Native, Expo, Redux state management, local database access, push notifications, and app store deployment.",
      price: 5999,
      thumbnailUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=500&h=280&fit=crop",
      teacherId: teacher.id,
      isPublished: true,
    },
  });
  console.log(`Created Course 6: ${course6.title}`);

  // 5. Create Course Videos (Lectures) for Course 1
  // We use public sample videos that play instantly in HTML5 players for testing
  const video1 = await prisma.courseVideo.create({
    data: {
      courseId: course1.id,
      title: "1. Introduction to Next.js App Router (Free Preview)",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      order: 1,
      isPreview: true, // Free preview available without enrollment
    },
  });

  const video2 = await prisma.courseVideo.create({
    data: {
      courseId: course1.id,
      title: "2. Server Components vs Client Components (Gated)",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      order: 2,
      isPreview: false, // Locked until enrollment is approved
    },
  });

  const video3 = await prisma.courseVideo.create({
    data: {
      courseId: course1.id,
      title: "3. Data Fetching with Prisma & React Suspense (Gated)",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      order: 3,
      isPreview: false, // Locked until enrollment is approved
    },
  });
  console.log("Created lectures for Course 1.");

  // Create one video for Course 2 (Gated)
  await prisma.courseVideo.create({
    data: {
      courseId: course2.id,
      title: "1. Setting up HTML & Visual Studio Code",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      order: 1,
      isPreview: false,
    },
  });
  console.log("Created lectures for Course 2.");

  // Create one video for Course 3 (Gated)
  await prisma.courseVideo.create({
    data: {
      courseId: course3.id,
      title: "1. Introduction to Product Design Frameworks",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      order: 1,
      isPreview: false,
    },
  });

  // Create one video for Course 4 (Gated)
  await prisma.courseVideo.create({
    data: {
      courseId: course4.id,
      title: "1. Scientific Python Environment Setup",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      order: 1,
      isPreview: false,
    },
  });

  // Create one video for Course 5 (Gated)
  await prisma.courseVideo.create({
    data: {
      courseId: course5.id,
      title: "1. Core Principles of Digital Marketing",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      order: 1,
      isPreview: false,
    },
  });

  // Create one video for Course 6 (Gated)
  await prisma.courseVideo.create({
    data: {
      courseId: course6.id,
      title: "1. Welcome to Cross-Platform Development",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      order: 1,
      isPreview: false,
    },
  });
  console.log("Created lectures for new courses.");

  // 6. Create Approved Enrollment + Verified Payment (Course 1)
  const approvedEnrollment = await prisma.enrollment.create({
    data: {
      studentId: student.id,
      courseId: course1.id,
      status: "APPROVED",
    },
  });

  await prisma.payment.create({
    data: {
      enrollmentId: approvedEnrollment.id,
      screenshotUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=300&h=300&fit=crop",
      transactionRef: "TXN-APPROVED-8829",
      amount: course1.price,
      status: "VERIFIED",
      verifiedById: admin.id,
    },
  });
  console.log("Created approved enrollment and verified payment for student in Course 1.");

  // 7. Create Pending Enrollment + Pending Payment (Course 2)
  const pendingEnrollment = await prisma.enrollment.create({
    data: {
      studentId: student.id,
      courseId: course2.id,
      status: "PENDING",
    },
  });

  await prisma.payment.create({
    data: {
      enrollmentId: pendingEnrollment.id,
      screenshotUrl: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?q=80&w=300&h=300&fit=crop",
      transactionRef: "UPI-PENDING-7711",
      amount: course2.price,
      status: "PENDING",
    },
  });
  console.log("Created pending enrollment and pending payment for student in Course 2 (Visible in Admin Approvals).");

  console.log("Rich seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
