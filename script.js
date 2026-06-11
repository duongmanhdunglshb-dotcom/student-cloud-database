// Import hàm createClient từ thư viện Supabase
import { createClient }
from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// URL của project Supabase
const supabaseUrl =
"https://lzajluuziausoascbjrp.supabase.co";

// API Key dùng để xác thực quyền truy cập database
const supabaseKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6YWpsdXV6aWF1c29hc2NianJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5ODA0NzEsImV4cCI6MjA5NjU1NjQ3MX0.aMLcgeP-x35f-_ta-_SRY0DN22p7ImaBd93NL-6H7MM";

// Tạo kết nối đến Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Hàm cập nhật thống kê số sinh viên và số lớp
function updateStats(data) {

  // Đếm tổng số sinh viên
  const total = data.length;

  // Lấy danh sách lớp không trùng nhau rồi đếm số lượng
  const classes = new Set(
    data.map(s => s.class_name)
  ).size;

  // Lấy phần tử HTML hiển thị tổng sinh viên
  const totalEl = document.getElementById("totalCount");

  // Lấy phần tử HTML hiển thị tổng lớp
  const classEl = document.getElementById("classCount");

  // Hiển thị tổng số sinh viên
  if (totalEl) totalEl.textContent = total;

  // Hiển thị tổng số lớp
  if (classEl) classEl.textContent = classes || "—";
}

// Hàm tải danh sách sinh viên từ Supabase
async function loadStudents() {

  // Lấy toàn bộ dữ liệu từ bảng students
  // và sắp xếp theo id tăng dần
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("id");

  // Nếu có lỗi thì in ra Console
  if (error) {
    console.log(error);
    return;
  }

  // Cập nhật thống kê
  updateStats(data || []);

  // Lấy tbody của bảng
  const tbody = document.getElementById("studentList");

  // Nếu chưa có sinh viên nào
  if (!data || data.length === 0) {

    // Hiển thị thông báo rỗng
    tbody.innerHTML = `
      <tr class="empty-row">
        <td colspan="5">
          <div class="empty-state">
            <p>No students enrolled yet.</p>
          </div>
        </td>
      </tr>
    `;

    return;
  }

  // Tạo chuỗi HTML để hiển thị dữ liệu
  let html = "";

  // Duyệt từng sinh viên
  data.forEach(student => {

    // Thêm từng dòng vào bảng
    html += `
    <tr>
      <td>#${student.id}</td>
      <td>${student.full_name}</td>
      <td>${student.student_code}</td>
      <td>${student.class_name}</td>

      <td>
        <button
          class="btn-delete"
          onclick="deleteStudent(${student.id})">
          Remove
        </button>
      </td>

    </tr>`;
  });

  // Đưa dữ liệu vào bảng
  tbody.innerHTML = html;
}

// Hàm thêm sinh viên
window.addStudent = async () => {

  // Lấy họ tên từ ô nhập
  const full_name =
    document.getElementById("fullname").value.trim();

  // Lấy mã sinh viên
  const student_code =
    document.getElementById("studentcode").value.trim();

  // Lấy tên lớp
  const class_name =
    document.getElementById("classname").value.trim();

  // Nếu có ô trống thì dừng
  if (!full_name || !student_code || !class_name)
    return;

  // Thêm dữ liệu vào bảng students
  await supabase
    .from("students")
    .insert([
      {
        full_name,
        student_code,
        class_name
      }
    ]);

  // Xóa dữ liệu trên form sau khi thêm
  document.getElementById("fullname").value = "";
  document.getElementById("studentcode").value = "";
  document.getElementById("classname").value = "";

  // Tải lại danh sách sinh viên
  loadStudents();
};

// Hàm xóa sinh viên theo id
window.deleteStudent = async (id) => {

  // Xóa bản ghi có id tương ứng
  await supabase
    .from("students")
    .delete()
    .eq("id", id);

  // Tải lại danh sách
  loadStudents();
};

// Khi mở trang web sẽ tự động tải dữ liệu
loadStudents();