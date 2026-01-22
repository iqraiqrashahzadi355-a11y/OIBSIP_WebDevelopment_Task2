import android.content.SharedPreferences;
import android.database.Cursor;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.SimpleCursorAdapter;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    DBHelper db;
    ListView taskList;
    EditText titleInput, detailsInput, dateInput;
    Button addBtn, logoutBtn;
    int userId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        db = new DBHelper(this);

        SharedPreferences sp = getSharedPreferences("login", MODE_PRIVATE);
        String username = sp.getString("username", null);
        if(username == null){
            finish();
        }
        userId = db.getUserId(username);

        taskList = findViewById(R.id.taskList);
        titleInput = findViewById(R.id.titleInput);
        detailsInput = findViewById(R.id.detailsInput);
        dateInput = findViewById(R.id.dateInput);
        addBtn = findViewById(R.id.addBtn);
        logoutBtn = findViewById(R.id.logoutBtn);

        loadTasks();

        addBtn.setOnClickListener(v -> {
            String title = titleInput.getText().toString();
            String details = detailsInput.getText().toString();
            String date = dateInput.getText().toString();
            if(db.addTask(userId, title, details, date)){
                Toast.makeText(this, "Task Added", Toast.LENGTH_SHORT).show();
                titleInput.setText(""); detailsInput.setText(""); dateInput.setText("");
                loadTasks();
            }
        });

        logoutBtn.setOnClickListener(v -> {
            sp.edit().clear().apply();
            finish();
        });
    }

    private void loadTasks(){
        Cursor cursor = db.getTasks(userId);
        String[] from = {"title", "details", "date"};
        int[] to = {R.id.taskTitle, R.id.taskDetails, R.id.taskDate};
        SimpleCursorAdapter adapter = new SimpleCursorAdapter(this, R.layout.task_item, cursor, from, to, 0);
        taskList.setAdapter(adapter);
    }
}
