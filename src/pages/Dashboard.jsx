import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const STATUS_COLORS = {
  "Todo": { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "rgba(251,191,36,0.3)" },
  "In Progress": { bg: "rgba(96,165,250,0.12)", color: "#60a5fa", border: "rgba(96,165,250,0.3)" },
  "Done": { bg: "rgba(52,211,153,0.12)", color: "#34d399", border: "rgba(52,211,153,0.3)" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "Admin";

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("tasks");

  // Task form
  const [taskForm, setTaskForm] = useState({ title: "", description: "", status: "Todo", dueDate: "", projectId: "" });
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Project form (Admin only)
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [showProjectForm, setShowProjectForm] = useState(false);

  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [tasksRes, statsRes, projectsRes] = await Promise.all([
        API.get("/tasks"),
        API.get("/tasks/dashboard"),
        API.get("/projects"),
      ]);
      setTasks(tasksRes.data || []);
      setStats(statsRes.data || {});
      setProjects(projectsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const createTask = async () => {
    if (!taskForm.title) return alert("Task title required");
    try {
      await API.post("/tasks", taskForm);
      setTaskForm({ title: "", description: "", status: "Todo", dueDate: "", projectId: "" });
      setShowTaskForm(false);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating task");
    }
  };

  const updateTask = async (id, data) => {
    try {
      await API.patch(`/tasks/${id}`, data);
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const createProject = async () => {
    if (!projectForm.name) return alert("Project name required");
    try {
      await API.post("/projects", projectForm);
      setProjectForm({ name: "", description: "" });
      setShowProjectForm(false);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating project");
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await API.delete(`/projects/${id}`);
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredTasks = tasks.filter((t) =>
    t.title?.toLowerCase().includes(search.toLowerCase())
  );

  const isOverdue = (task) =>
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Done";

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--text2)", fontFamily: "var(--font)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
        <div>Loading TaskFlow...</div>
      </div>
    </div>
  );

  return (
    <div style={s.app}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.brand}>
            <span style={{ fontSize: 22 }}>⚡</span>
            <span style={s.brandText}>TaskFlow</span>
          </div>
          <div style={s.userBox}>
            <div style={s.avatar}>{user.name?.[0]?.toUpperCase() || "U"}</div>
            <div>
              <div style={s.userName}>{user.name || "User"}</div>
              <div style={s.userRole}>{user.role || "Member"}</div>
            </div>
          </div>
          <nav style={s.nav}>
            {[
              { id: "tasks", icon: "✓", label: "Tasks" },
              { id: "projects", icon: "◈", label: "Projects" },
              { id: "stats", icon: "◉", label: "Dashboard" },
            ].map((item) => (
              <button
                key={item.id}
                style={{ ...s.navBtn, ...(activeTab === item.id ? s.navBtnActive : {}) }}
                onClick={() => setActiveTab(item.id)}
              >
                <span style={s.navIcon}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <button style={s.logoutBtn} onClick={logout}>
          ↩ Logout
        </button>
      </div>

      {/* Main */}
      <div style={s.main}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.pageTitle}>
              {activeTab === "tasks" ? "Tasks" : activeTab === "projects" ? "Projects" : "Dashboard"}
            </h1>
            <p style={s.pageSub}>
              {activeTab === "tasks" ? `${filteredTasks.length} tasks total` : activeTab === "projects" ? `${projects.length} projects` : "Your overview"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {activeTab === "tasks" && (
              <button style={s.addBtn} onClick={() => setShowTaskForm(!showTaskForm)}>
                + New Task
              </button>
            )}
            {activeTab === "projects" && isAdmin && (
              <button style={s.addBtn} onClick={() => setShowProjectForm(!showProjectForm)}>
                + New Project
              </button>
            )}
          </div>
        </div>

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div>
            <div style={s.statsGrid}>
              {[
                { label: "Total Tasks", value: stats.totalTasks || 0, color: "var(--accent)", icon: "◼" },
                { label: "Completed", value: stats.completedTasks || 0, color: "var(--green)", icon: "✓" },
                { label: "In Progress", value: stats.inProgressTasks || 0, color: "var(--blue)", icon: "◑" },
                { label: "Todo", value: stats.todoTasks || 0, color: "var(--yellow)", icon: "○" },
                { label: "Overdue", value: stats.overdueTasks || 0, color: "var(--red)", icon: "!" },
                { label: "Projects", value: projects.length, color: "var(--accent2)", icon: "◈" },
              ].map((stat) => (
                <div key={stat.label} style={s.statCard}>
                  <div style={{ ...s.statIcon, color: stat.color }}>{stat.icon}</div>
                  <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
                  <div style={s.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent tasks in stats */}
            <div style={s.section}>
              <h2 style={s.sectionTitle}>Recent Tasks</h2>
              {tasks.slice(0, 5).map((task) => (
                <div key={task._id} style={s.taskRowSimple}>
                  <span style={{ color: "var(--white)", fontWeight: 500 }}>{task.title}</span>
                  <span style={{ ...s.badge, ...STATUS_COLORS[task.status] }}>{task.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div>
            {showTaskForm && (
              <div style={s.formCard}>
                <h3 style={s.formTitle}>New Task</h3>
                <div style={s.formGrid}>
                  <input
                    style={s.input}
                    placeholder="Task title *"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  />
                  <input
                    style={s.input}
                    placeholder="Description"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  />
                  <select
                    style={s.input}
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                  <select
                    style={s.input}
                    value={taskForm.projectId}
                    onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
                  >
                    <option value="">No Project</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    style={s.input}
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  />
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button style={s.addBtn} onClick={createTask}>Create Task</button>
                  <button style={s.cancelBtn} onClick={() => setShowTaskForm(false)}>Cancel</button>
                </div>
              </div>
            )}

            {/* Search */}
            <div style={{ marginBottom: 20 }}>
              <input
                style={{ ...s.input, maxWidth: 360 }}
                placeholder="🔍  Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Task List */}
            {filteredTasks.length === 0 ? (
              <div style={s.empty}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                <div style={{ color: "var(--text2)" }}>No tasks yet. Create your first task!</div>
              </div>
            ) : (
              <div style={s.taskList}>
                {filteredTasks.map((task) => (
                  <div key={task._id} style={{ ...s.taskCard, ...(isOverdue(task) ? s.taskOverdue : {}) }}>
                    <div style={s.taskLeft}>
                      <div style={s.taskTitle}>{task.title}</div>
                      {task.description && <div style={s.taskDesc}>{task.description}</div>}
                      <div style={s.taskMeta}>
                        {task.projectId && (
                          <span style={s.metaTag}>◈ {task.projectId.name}</span>
                        )}
                        {task.dueDate && (
                          <span style={{ ...s.metaTag, color: isOverdue(task) ? "var(--red)" : "var(--text2)" }}>
                            📅 {new Date(task.dueDate).toLocaleDateString()}
                            {isOverdue(task) && " • Overdue"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={s.taskRight}>
                      <select
                        style={{ ...s.statusSelect, ...STATUS_COLORS[task.status] }}
                        value={task.status}
                        onChange={(e) => updateTask(task._id, { status: e.target.value })}
                      >
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                      <button style={s.deleteBtn} onClick={() => deleteTask(task._id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div>
            {showProjectForm && isAdmin && (
              <div style={s.formCard}>
                <h3 style={s.formTitle}>New Project</h3>
                <div style={s.formGrid}>
                  <input
                    style={s.input}
                    placeholder="Project name *"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  />
                  <input
                    style={s.input}
                    placeholder="Description"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  />
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button style={s.addBtn} onClick={createProject}>Create Project</button>
                  <button style={s.cancelBtn} onClick={() => setShowProjectForm(false)}>Cancel</button>
                </div>
              </div>
            )}

            {projects.length === 0 ? (
              <div style={s.empty}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
                <div style={{ color: "var(--text2)" }}>
                  {isAdmin ? "No projects yet. Create your first project!" : "No projects assigned to you yet."}
                </div>
              </div>
            ) : (
              <div style={s.projectGrid}>
                {projects.map((project) => {
                  const projectTasks = tasks.filter((t) => t.projectId?._id === project._id);
                  const doneTasks = projectTasks.filter((t) => t.status === "Done").length;
                  const progress = projectTasks.length ? Math.round((doneTasks / projectTasks.length) * 100) : 0;

                  return (
                    <div key={project._id} style={s.projectCard}>
                      <div style={s.projectHeader}>
                        <div style={s.projectIcon}>◈</div>
                        {isAdmin && (
                          <button style={s.deleteBtn} onClick={() => deleteProject(project._id)}>✕</button>
                        )}
                      </div>
                      <h3 style={s.projectName}>{project.name}</h3>
                      {project.description && <p style={s.projectDesc}>{project.description}</p>}
                      <div style={s.progressBar}>
                        <div style={{ ...s.progressFill, width: `${progress}%` }} />
                      </div>
                      <div style={s.projectFooter}>
                        <span style={{ color: "var(--text2)", fontSize: 13 }}>{doneTasks}/{projectTasks.length} tasks done</span>
                        <span style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600 }}>{progress}%</span>
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <span style={{ fontSize: 12, color: "var(--text2)" }}>
                          Owner: {project.owner?.name || "You"} •{" "}
                          {project.members?.length || 0} members
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  app: { display: "flex", minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--font)" },
  sidebar: { width: 240, background: "var(--bg2)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "24px 0", position: "sticky", top: 0, height: "100vh" },
  sideTop: { padding: "0 16px" },
  brand: { display: "flex", alignItems: "center", gap: 10, marginBottom: 32, paddingLeft: 4 },
  brandText: { fontFamily: "var(--heading)", fontSize: 20, color: "var(--white)", fontWeight: 800 },
  userBox: { display: "flex", alignItems: "center", gap: 12, background: "var(--bg3)", borderRadius: 12, padding: "12px 14px", marginBottom: 24 },
  avatar: { width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0 },
  userName: { color: "var(--white)", fontWeight: 600, fontSize: 14 },
  userRole: { color: "var(--accent)", fontSize: 12, fontWeight: 500 },
  nav: { display: "flex", flexDirection: "column", gap: 4 },
  navBtn: { display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, border: "none", background: "transparent", color: "var(--text2)", fontSize: 15, fontWeight: 500, cursor: "pointer", transition: "all 0.15s", textAlign: "left", width: "100%" },
  navBtnActive: { background: "var(--bg3)", color: "var(--white)", borderLeft: "2px solid var(--accent)" },
  navIcon: { fontSize: 16, width: 20, textAlign: "center" },
  logoutBtn: { margin: "0 16px", padding: "11px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "transparent", color: "var(--text2)", fontSize: 14, cursor: "pointer", textAlign: "left" },
  main: { flex: 1, padding: "32px 36px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  pageTitle: { fontFamily: "var(--heading)", fontSize: 28, color: "var(--white)", fontWeight: 800, marginBottom: 4 },
  pageSub: { color: "var(--text2)", fontSize: 14 },
  addBtn: { padding: "10px 20px", background: "linear-gradient(135deg, var(--accent), var(--accent2))", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" },
  cancelBtn: { padding: "10px 20px", background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 14, cursor: "pointer" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 32 },
  statCard: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, padding: "24px 20px", textAlign: "center" },
  statIcon: { fontSize: 22, marginBottom: 10 },
  statValue: { fontSize: 36, fontFamily: "var(--heading)", fontWeight: 800, lineHeight: 1 },
  statLabel: { color: "var(--text2)", fontSize: 13, marginTop: 6 },
  section: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 },
  sectionTitle: { fontFamily: "var(--heading)", fontSize: 18, color: "var(--white)", fontWeight: 700, marginBottom: 16 },
  taskRowSimple: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" },
  badge: { padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "1px solid" },
  formCard: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 24 },
  formTitle: { color: "var(--white)", fontWeight: 700, marginBottom: 16, fontSize: 16 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  input: { width: "100%", padding: "11px 14px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--white)", fontSize: 14, outline: "none" },
  taskList: { display: "flex", flexDirection: "column", gap: 10 },
  taskCard: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 },
  taskOverdue: { borderColor: "rgba(248,113,113,0.4)", background: "rgba(248,113,113,0.04)" },
  taskLeft: { flex: 1 },
  taskTitle: { color: "var(--white)", fontWeight: 600, fontSize: 15, marginBottom: 4 },
  taskDesc: { color: "var(--text2)", fontSize: 13, marginBottom: 8 },
  taskMeta: { display: "flex", gap: 12, flexWrap: "wrap" },
  metaTag: { fontSize: 12, color: "var(--text2)" },
  taskRight: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 },
  statusSelect: { padding: "6px 12px", borderRadius: 8, border: "1px solid", fontSize: 13, fontWeight: 600, cursor: "pointer", outline: "none", background: "transparent" },
  deleteBtn: { width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text2)", cursor: "pointer", fontSize: 13 },
  empty: { textAlign: "center", padding: "80px 20px", color: "var(--text)" },
  projectGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 },
  projectCard: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 },
  projectHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  projectIcon: { fontSize: 24, color: "var(--accent2)" },
  projectName: { color: "var(--white)", fontWeight: 700, fontSize: 18, marginBottom: 6 },
  projectDesc: { color: "var(--text2)", fontSize: 13, marginBottom: 16 },
  progressBar: { height: 6, background: "var(--bg3)", borderRadius: 3, overflow: "hidden", marginBottom: 8 },
  progressFill: { height: "100%", background: "linear-gradient(90deg, var(--accent), var(--accent2))", borderRadius: 3, transition: "width 0.5s ease" },
  projectFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
};
