\set ON_ERROR_STOP on

-- Create the application role only when it does not exist.
SELECT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'notes_user') AS role_exists \gset
\if :role_exists
    \echo User notes_user already exists. Its password will not be changed.
\else
    CREATE ROLE notes_user WITH LOGIN;
    -- psql asks for the password without displaying it.
    \password notes_user
\endif

-- CREATE DATABASE cannot run inside a transaction.
-- gexec executes the generated statement only if the database is missing.
SELECT 'CREATE DATABASE notes_app OWNER notes_user'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'notes_app')
\gexec

-- Check existing installations too, without changing ownership or deleting data.
SELECT EXISTS (
    SELECT 1 FROM pg_database d
    JOIN pg_roles r ON r.oid = d.datdba
    WHERE d.datname = 'notes_app' AND r.rolname = 'notes_user' AND r.rolcanlogin
) AS setup_ok \gset
\if :setup_ok
    \echo Database notes_app is ready. Owner: notes_user.
\else
    \echo ERROR: Check that notes_user can log in and owns notes_app.
    \quit 1
\endif
