import { createClient }
from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl =
"https://lzajluuziausoascbjrp.supabase.co";

const supabaseKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6YWpsdXV6aWF1c29hc2NianJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5ODA0NzEsImV4cCI6MjA5NjU1NjQ3MX0.aMLcgeP-x35f-_ta-_SRY0DN22p7ImaBd93NL-6H7MM";

const supabase =
createClient(supabaseUrl, supabaseKey);

async function loadStudents() {

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("id");

  if (error) {
    console.log(error);
    return;
  }

  let html = "";

  data.forEach(student => {

    html += `
    <tr>
      <td>${student.id}</td>
      <td>${student.full_name}</td>
      <td>${student.student_code}</td>
      <td>${student.class_name}</td>
      <td>
        <button onclick="deleteStudent(${student.id})">
          Delete
        </button>
      </td>
    </tr>
    `;
  });

  document.getElementById("studentList").innerHTML = html;
}

window.addStudent = async () => {

  const full_name =
    document.getElementById("fullname").value;

  const student_code =
    document.getElementById("studentcode").value;

  const class_name =
    document.getElementById("classname").value;

  await supabase
    .from("students")
    .insert([
      {
        full_name,
        student_code,
        class_name
      }
    ]);

  loadStudents();
}

window.deleteStudent = async (id) => {

  await supabase
    .from("students")
    .delete()
    .eq("id", id);

  loadStudents();
}

loadStudents();