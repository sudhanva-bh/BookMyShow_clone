# Live Demo SQL Queries

## Objective

This directory contains standalone, raw SQL scripts designed specifically for the live evaluation demo.

The evaluation strategy states:
*"During the demo, students will be asked to perform updates through both the front-end interface and direct database operations."*

These scripts allow you to execute precise, typo-free database operations instantly during the demo.

---

## Execution

### Method 1: Copy and Paste (Recommended When Explaining Logic)

Use this method if the evaluator asks you to walk through the query step-by-step.

1. Open your PostgreSQL CLI (`psql`) or pgAdmin Query Tool.
2. Connect to the database:

   ```sql
   \c bookmyshow
   ```
3. Open the required `.sql` file in a text editor.
4. Copy the query.
5. Paste it into the terminal or query tool and execute it.

---

### Method 2: Direct File Execution (Fastest Method)

Use this method if the evaluator wants to see immediate execution.

1. Ensure you are connected to the database in `psql`:

   ```
   bookmyshow=#
   ```
2. Execute the script using the `\i` command with the absolute file path:

   ```sql
   \i 'C:/path/to/project/database/presentation_queries/users/01_create.sql'
   ```

Repeat the same pattern for other scripts:

```sql
\i 'C:/path/to/project/database/presentation_queries/users/02_read.sql'
\i 'C:/path/to/project/database/presentation_queries/users/03_update.sql'
\i 'C:/path/to/project/database/presentation_queries/users/04_delete.sql'
```