// Add columns to tasks table
db.execSQL("CREATE TABLE tasks(id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, title TEXT, details TEXT, date TEXT, priority TEXT, reminder INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))");

// Add task method
public boolean addTask(int userId, String title, String details, String date, String priority, int reminder) {
    SQLiteDatabase db = this.getWritableDatabase();
    ContentValues cv = new ContentValues();
    cv.put("user_id", userId);
    cv.put("title", title);
    cv.put("details", details);
    cv.put("date", date);
    cv.put("priority", priority);
    cv.put("reminder", reminder); // 0 = no reminder, 1 = set
    long res = db.insert("tasks", null, cv);
    return res != -1;
}
