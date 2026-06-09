console.log("APP LOADED");
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://lzajluuziausoascbjrp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6YWpsdXV6aWF1c29hc2JycCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzgwOTgwNDcxLCJleHAiOjIwOTY1NTY0NzF9.aMLcgeP-x35f-_ta-_SRY0DN22p7ImaBd93NL-6H7MM";

const supabase = createClient(supabaseUrl, supabaseKey);

async function loadStudents() {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("id");

  if (error) {
    console.error(error);
    return;
  }

  let html = "";
  data.forEach((student) => {
    html += `
      <tr>
        <td>${student.id}</td>
        <td>${student.full_name}</td>
        <td>${student.student_code}</td>
        <td>${student.class_name}</td>
        <td>
          <button data-id="${student.id}" class="delete-btn">Delete</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("studentList").innerHTML = html;

  // Attach event listeners for delete buttons after rendering
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      deleteStudent(id);
    });
  });
}

async function addStudent() {
  const full_name = document.getElementById("fullname").value.trim();
  const student_code = document.getElementById("studentcode").value.trim();
  const class_name = document.getElementById("classname").value.trim();

  if (!full_name || !student_code || !class_name) {
    alert("Please fill in all fields.");
    return;
  }

  await supabase.from("students").insert([
    { full_name, student_code, class_name }
  ]);

  // Clear input fields
  document.getElementById("fullname").value = "";
  document.getElementById("studentcode").value = "";
  document.getElementById("classname").value = "";

  loadStudents();
}

async function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) return;

  await supabase.from("students").delete().eq("id", id);
  loadStudents();
}

// Initialize
document.getElementById("addButton").addEventListener("click", addStudent);
loadStudents();
