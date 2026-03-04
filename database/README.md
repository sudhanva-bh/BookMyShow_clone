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

Use this method if the evaluator wants to see immediate execution. Run the following from the root directory of the project.

1. Open your terminal, enter `psql`, and connect to the database:

```bash
psql -U postgres

```

Inside `psql`:

```sql
\c bookmyshow

```

2. Execute the required files using the `\i` command:

#### Users

```sql
\i database/presentation_queries/users/01_create.sql
\i database/presentation_queries/users/02_read.sql
\i database/presentation_queries/users/03_update.sql
\i database/presentation_queries/users/04_delete.sql

```

#### Movies

```sql
\i database/presentation_queries/movies/01_create.sql
\i database/presentation_queries/movies/02_read.sql
\i database/presentation_queries/movies/03_update.sql
\i database/presentation_queries/movies/04_delete.sql

```

#### Theatres

```sql
\i database/presentation_queries/theatres/01_create.sql
\i database/presentation_queries/theatres/02_read.sql
\i database/presentation_queries/theatres/03_update.sql
\i database/presentation_queries/theatres/04_delete.sql
```

#### Screens

```sql
\i database/presentation_queries/screen/01_create.sql
\i database/presentation_queries/screen/02_read.sql
\i database/presentation_queries/screen/03_update.sql
\i database/presentation_queries/screen/04_delete.sql
```

#### Seats

```sql
\i database/presentation_queries/seats/01_create.sql
\i database/presentation_queries/seats/02_read.sql
\i database/presentation_queries/seats/03_update.sql
\i database/presentation_queries/seats/04_delete.sql
```

#### Shows

```sql
\i database/presentation_queries/show/01_create.sql
\i database/presentation_queries/show/02_read.sql
\i database/presentation_queries/show/03_update.sql
\i database/presentation_queries/show/04_delete.sql
\i database/presentation_queries/show/05_get_seats.sql
```

#### Bookings

```sql
\i database/presentation_queries/bookings/01_create_booking_transaction.sql
\i database/presentation_queries/bookings/02_read_user_bookings.sql
```

#### Payments

```sql
\i database/presentation_queries/payments/01_process_payment_success.sql
\i database/presentation_queries/payments/02_process_payment_failure.sql
```

#### Jobs

```sql
\i database/presentation_queries/jobs/01_cleanup_expired_seats.sql
```
