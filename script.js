import { createClient }
from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl =
"https://lzajluuziausoascbjrp.supabase.co";

const supabaseKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6YWpsdXV6aWF1c29hc2NianJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5ODA0NzEsImV4cCI6MjA5NjU1NjQ3MX0.aMLcgeP-x35f-_ta-_SRY0DN22p7ImaBd93NL-6H7MM";

const supabase = createClient(supabaseUrl, supabaseKey);

function updateStats(data) {
  const total = data.length;
  const classes = new Set(data.map(s => s.class_name)).size;
  const totalEl = document.getElementById("totalCount");
  const classEl = document.getElementById("classCount");
  if (totalEl) totalEl.textContent = total;
  if (classEl) classEl.textContent = classes || "—";
}

async function loadStudents() {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("id");

  if (error) { console.log(error); return; }

  updateStats(data || []);

  const tbody = document.getElementById("studentList");

  if (!data || data.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-row">
        <td colspan="5">
          <div class="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <p>No students enrolled yet.<br>Add your first student above.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  let html = "";
  data.forEach(student => {
    html += `
    <tr>
      <td>#${student.id}</td>
      <td>${student.full_name}</td>
      <td>${student.student_code}</td>
      <td><span>${student.class_name}</span></td>
      <td>
        <button class="btn-delete" onclick="deleteStudent(${student.id})">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          </svg>
          Remove
        </button>
      </td>
    </tr>`;
  });

  tbody.innerHTML = html;
}

window.addStudent = async () => {
  const full_name    = document.getElementById("fullname").value.trim();
  const student_code = document.getElementById("studentcode").value.trim();
  const class_name   = document.getElementById("classname").value.trim();

  if (!full_name || !student_code || !class_name) return;

  await supabase.from("students").insert([{ full_name, student_code, class_name }]);

  document.getElementById("fullname").value = "";
  document.getElementById("studentcode").value = "";
  document.getElementById("classname").value = "";

  loadStudents();
}

window.deleteStudent = async (id) => {
  await supabase.from("students").delete().eq("id", id);
  loadStudents();
}

loadStudents();