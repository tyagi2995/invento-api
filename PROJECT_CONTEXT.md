📦 Multi-Office Inventory Management System – Project Context
We are building a multi-office inventory management system where employees, departments, and offices interact with items (consumable, reusable, shared).
🎯 Core Objectives

Track purchases (multiple items in one bill, from vendors).

Trace each item’s lifecycle (Purchased → Issued → Returned → Repaired → Re-issued → Scrapped).

Handle both consumables (pen, notebook) and reusable/serial-numbered items (laptop, AC, mobile).

Support multi-office, multi-department, multi-role usage.

Provide searching, filtering, sorting, reporting across all dimensions (employee, department, office, vendor, bill, serial number, status, date range).

👥 Roles

Employee → can see only items issued to themselves.

Department Manager → can see/manage items issued to their department and employees.

Store Manager → manages stock, purchases, issues, returns, repairs.

Admin → full visibility across all offices.

🗂️ Item Types

Reusable (Laptop, Mobile, Printer, AC) → Track by serial number. Can be issued, returned, repaired, re-issued, scrapped.

Consumable (Pen, Notebook, Marker) → Tracked only by quantity. Once issued, cannot be returned.

Shared (Watercooler, AC for department) → Assigned to departments or entire offices, not individual employees.

🏛️ Database Design (Core Tables)

offices → Multi-office support.

departments → Departments under each office.

employees → Employees with role & department.

items → Master catalog of items (category, type).

purchases → Purchase bills (vendor, bill number, date).

purchase_items → Items purchased in a bill (quantity, price).

item_units → For reusable/serial-numbered items (serial number, status, assigned employee/department).

item_transactions → Full history log (issue, return, repair, scrap, purchase).

🔎 Searching & Filtering

System must support flexible queries:

By serial number (exact match).

By item type / category / status.

By employee, department, office.

By vendor / bill number / purchase date range.

By transaction type (Issue, Return, Repair, Scrap).

By current availability (Available / Issued / In Repair / Scrapped).

Indexes planned on: serial_number, status, bill_number, vendor_name, transaction_date, employee_id, department_id, office_id.

📊 Example Use Cases

“Show all laptops issued in Office A between Sept 1–10, 2025.”

“Find items purchased from Vendor X with bill number 123.”

“Which employee currently has Laptop SN LAP123?”

“How many pens were issued in Admin department last month?”

“Show full history of Laptop SN LAP123.”

🛠️ Tech Stack (Planned)

Frontend: React.js (Admin panel, role-based dashboards).

Backend: Node.js (Express)

Database: MySQL (with Sequelize ORM in Node.js).

Authentication: JWT / Role-based access.

✅ Key Features

Multi-office, department-wise management.

Serial-number tracking for reusable items.

Quantity-based management for consumables.

Repair & reissue workflows.

Role-based dashboards.

Advanced search & filter APIs.

Reports export (CSV, Excel).

⚡ Instruction: When generating code, migrations, API endpoints, always align with this schema and support advanced search/filter/report features.
