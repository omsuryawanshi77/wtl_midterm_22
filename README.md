# 🎓 Mentor Management System

A dynamic, web-based **Mentor Management System** built with **PHP**, **MySQL**, **JavaScript (Fetch API)**, and **HTML5/CSS3**. This application enables educational institutions and organizations to seamlessly manage mentor details, track mentee capacities, and store mentor profile images with real-time CRUD (Create, Read, Update, Delete) capabilities.

---

## 🚀 Live Demo

- **Live Website:** [http://mentor-management-system.freedev.app](http://mentor-management-system.freedev.app)
- **GitHub Repository:** [https://github.com/omsuryawanshi77/wtl_midterm_22](https://github.com/omsuryawanshi77/wtl_midterm_22)

---

## ✨ Features

- 📋 **Complete CRUD Functionality**: Add new mentors, view records, edit existing details, and delete entries seamlessly.
- ⚡ **Asynchronous Data Handling**: Uses JavaScript **Fetch API** for instant UI updates without page reloads.
- 🖼️ **Profile Photo Upload**: Server-side image upload handling with path management in the `uploads/` directory.
- 🔍 **Form Validation & Dynamic Logic**: Includes validation for unique Employee IDs, photo inputs, and capacity limits.
- 🗄️ **Relational Database Storage**: Backed by MySQL (`mentor_db`) with `mentors` schema enforcement.
- 🌐 **Cloud Deployed**: Configured for free hosting environments like **InfinityFree** (Apache + MySQL + cPanel).

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+, Fetch API)
- **Backend**: PHP 7.x / 8.x
- **Database**: MySQL / MariaDB
- **Hosting / Deployment**: InfinityFree (cPanel, FTP/File Manager)
- **Version Control**: Git & GitHub

---

## 📁 Project Structure

```text
mentor-management-system/
│
├── uploads/                 # Server directory for stored mentor profile photos
│   └── .gitkeep             # Preserves empty uploads folder in Git
├── .gitignore               # Ignores uploaded image files from version control
├── index.html               # Main user interface (Form + Mentor Records Table)
├── script.js                # Frontend logic & AJAX Fetch API request handling
├── db.php                   # Database connection configuration file
├── add_mentor.php           # API endpoint for adding a new mentor record & photo
├── fetch_mentors.php        # API endpoint for retrieving all mentor records
├── update_mentor.php        # API endpoint for editing existing mentor details
├── delete_mentor.php        # API endpoint for removing mentor records
└── README.md                # Project documentation
