# Database setup

Prerequisite: PostgreSQL must be installed and running. This script does not install PostgreSQL or register Windows services.

From the project root, on Windows (PowerShell):

```powershell
.\scripts\setup-db.ps1
```

If psql is installed elsewhere:

```powershell
.\scripts\setup-db.ps1 -PsqlPath 'C:\path\to\PostgreSQL\bin\psql.exe'
```

On Linux/macOS, with psql available in PATH:

```bash
bash scripts/setup-db.sh
```

Enter the PostgreSQL administrator password when prompted. If notes_user is new, you will also be asked to choose its password twice. Passwords are not displayed or stored by these scripts.

The scripts create notes_user and notes_app only when missing. On repeated runs, existing passwords and data remain unchanged. The final check verifies that notes_user can log in and owns notes_app; it does not check the application password.

Expected final message:

```text
Database notes_app is ready. Owner: notes_user.
```

To test the application login separately on Windows:

```powershell
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -h localhost -U notes_user -d notes_app -W -c 'SELECT current_user, current_database();'
```

Use the notes_user password for this check, not the administrator password.

The setup script creates the database and role, not the application tables. After configuring the root .env, run `npm --prefix backend run db:migrate` to create or update the tables. See the root README.md for the full startup instructions. No local .env files are overwritten.
