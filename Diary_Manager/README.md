# Diary Manager

A command-line diary application built in C that allows users to add, view, search, and delete diary entries with persistent file-based storage.

## Features

- **Add Entry** — Write a diary entry for a specific date
- **View Entries** — Display all saved diary entries
- **Search Entry** — Look up a diary entry by date
- **Delete Entry** — Remove a diary entry by date
- **Save & Exit** — Persist all changes to disk

## Tech Stack

- **Language:** C
- **Concepts:** File I/O, CRUD operations, structured programming, menu-driven CLI
- **IDE:** VS Code

## How to Run

### Prerequisites
- GCC compiler installed
- Any terminal (Linux, macOS, or Windows with WSL/MinGW)

### Steps

```bash
# Clone the repository
git clone https://github.com/akashbhuma/Projects_by_Akash.git

# Navigate to the project folder
cd Projects_by_Akash/Diary_Manager

# Compile
gcc diary_manager.c -o diary_manager

# Run
./diary_manager
```

## Usage

| Option | Action |
|--------|--------|
| 1 | Add a new diary entry |
| 2 | View all entries |
| 3 | Search entry by date |
| 4 | Delete entry by date |
| 5 | Save and exit |

- Enter dates in `DD/MM/YYYY` format
- When adding an entry, type `DONE` on a new line to finish input
- Entries are limited to **1000 characters**
- All entries are saved to `Diary_entry.txt` automatically on exit

## Sample Output

```
Diary Manager
1. Add Entry
2. View Entries
3. Search Entries
4. Delete Entries
5. Save and Exit
Enter your choice: 1
Enter the date in DD/MM/YYYY format: 24/11/2024
Entry your diary entry (Type DONE in a new line after the entry.): Today was productive.
DONE
Entry added successfully to date: 24/11/2024
```

## Project Structure

```
Diary_Manager/
├── diary_manager.c      # Main source file
├── Diary_entry.txt      # Auto-generated storage file
└── README.md
```

## Author

**Akash Bhuma**  
B.Tech Computer Science Engineering, Mahindra University  
[GitHub](https://github.com/akashbhuma) | [LinkedIn](https://linkedin.com/in/akash-bhuma)
