import { useMemo, useState, useEffect } from "react";
import { Container, Card, Button, Nav, Badge, Spinner, Alert } from "react-bootstrap";
import { ArrowLeft, Calendar as CalendarIcon, RussianRuble, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./AvailabilityPage.module.css";
import { useNavigate, useParams } from "react-router-dom";

const demoAvailability = {
  "2025-09-05": "booked",
  "2025-09-07": "blocked",
  "2025-09-12": "partial",
  "2025-09-18": "booked",
  "2025-09-19": "booked",
  "2025-09-24": "available",
  "2025-09-27": "booked",
};

const WEEKDAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const MONTHS_RU = [
  "Январь","Февраль","Март","Апрель","Май","Июнь",
  "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"
];

function startOfMonth(date){ return new Date(date.getFullYear(), date.getMonth(), 1); }
function endOfMonth(date){ return new Date(date.getFullYear(), date.getMonth()+1, 0); }
function addMonths(date, n){ return new Date(date.getFullYear(), date.getMonth()+n, 1); }
// Format local date without UTC shift
function toDayKeyLocal(date){
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,'0');
  const d = String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}
function toMonthKey(date){
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,'0');
  return `${y}-${m}`;
}
function getCalendarMatrix(viewDate){
  const first = startOfMonth(viewDate);
  const last  = endOfMonth(viewDate);
 
  const firstWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = last.getDate();

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null); 
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
  }

  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i=0;i<cells.length;i+=7) weeks.push(cells.slice(i,i+7));
  return weeks;
}

function statusToClass(status){
  switch(status){
    case "available": return "dayAvailable";
    case "partial":   return "dayPartial";
    case "booked":    return "dayBooked";
    case "blocked":   return "dayBlocked";
    default:          return "";
  }
}

export default function AvailabilityPage(){
  const navigate = useNavigate();
  const params = useParams();
  const boatId = params?.boatId ?? "demo";

  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date())); 
  const [activeTab, setActiveTab] = useState("calendar");
  const [selected, setSelected]   = useState(null); 
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const weeks = useMemo(()=>getCalendarMatrix(viewDate), [viewDate]);

  const monthLabel = `${MONTHS_RU[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

  const onPrev = () => setViewDate(d => addMonths(d, -1));
  const onNext = () => setViewDate(d => addMonths(d, +1));
  const onBack = () => navigate(-1);

  // Fetch availability for current boat and month
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const monthKey = toMonthKey(viewDate);
        const res = await fetch(`/api/boats/${boatId}/availability?month=${monthKey}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setAvailability(json || {});
      } catch (e) {
        if (e.name === 'AbortError') return;
        setError(e);
        // Keep previous data; optionally fall back to demo for empty state
        if (!Object.keys(availability).length) setAvailability({});
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [boatId, viewDate]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Button variant="link" className={styles.iconBtn} aria-label="Назад" onClick={onBack}>
          <ArrowLeft size={18} className={styles.icon} strokeWidth={1.33} />
        </Button>
        <div className={styles.headerTitle}>Управление доступностью</div>
        <div className={styles.headerSpacer} />
      </div>

      <Container className={styles.tabsWrap}>
        <Nav variant="pills" activeKey={activeTab} onSelect={(k)=>setActiveTab(k)} className={styles.tabs}>
          <Nav.Item>
            <Nav.Link
              eventKey="calendar"
              className={[styles.tab, activeTab === "calendar" ? styles.tabActive : ""].join(" ")}
            >
              <CalendarIcon size={16} className={styles.tabIcon} /> Календарь
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="prices"
              className={[styles.tab, activeTab === "prices" ? styles.tabActive : ""].join(" ")}
            >
              <RussianRuble size={16} className={styles.tabIcon} /> Цены
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>

      <Container className={styles.content}>
        {error && (
          <Alert variant="warning">Не удалось загрузить данные календаря. Попробуйте позже.</Alert>
        )}
        {activeTab === "calendar" && (
          <>
            <Card className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Календарь доступности</div>
                <div className={styles.monthSwitcher}>
                  <Button variant="light" size="sm" onClick={onPrev} className={styles.iconBtn}>
                    <ChevronLeft size={18} />
                  </Button>
                  <div className={styles.monthLabel}>
                    <CalendarIcon size={16} className={styles.monthIcon} />
                    {monthLabel}
                  </div>
                  <Button variant="light" size="sm" onClick={onNext} className={styles.iconBtn}>
                    <ChevronRight size={18} />
                  </Button>
                </div>
              </div>


              <div className={styles.calendar}>
                {loading && (
                  <div className={styles.placeholder}>
                    <Spinner animation="border" size="sm" /> Загрузка...
                  </div>
                )}
                <div className={styles.weekRow}>
                  {WEEKDAYS.map((d)=>(
                    <div key={d} className={`${styles.cell} ${styles.cellHead}`}>{d}</div>
                  ))}
                </div>
                {weeks.map((week, wi)=>(
                  <div key={wi} className={styles.weekRow}>
                    {week.map((date, di)=>{
                      if (!date) return <div key={di} className={`${styles.cell} ${styles.cellEmpty}`} />;
                      const iso = toDayKeyLocal(date);
                      const st  = availability[iso] ?? demoAvailability[iso]; 
                      const isSelected = selected === iso;
                      return (
                        <button
                          key={di}
                          type="button"
                          className={[
                            styles.cell,
                            styles.cellDay,
                            st ? styles[statusToClass(st)] : "",
                            isSelected ? styles.cellSelected : ""
                          ].join(" ")}
                          onClick={()=>setSelected(iso)}
                        >
                          <span className={styles.dayNum}>{date.getDate()}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Card>

            <Card className={styles.legendCard}>
              <div className={styles.legendRow}>
                <LegendDot color="#22c55e" label="Доступно" />
                <LegendDot color="#f59e0b" label="Частично занято" />
                <LegendDot color="#ef4444" label="Забронировано" />
                <LegendDot color="#9ca3af" label="Заблокировано" />
              </div>
            </Card>
          </>
        )}

        {activeTab === "prices" && (
          <Card className={styles.card}>
            <div className={styles.placeholder}>Здесь будет управление ценами</div>
          </Card>
        )}
        {activeTab === "blocks" && (
          <Card className={styles.card}>
            <div className={styles.placeholder}>Здесь будет управление блокировками</div>
          </Card>
        )}
      </Container>
    </div>
  );
}

function LegendDot({ color, label }){
  return (
    <div className={styles.legendItem}>
      <span className={styles.legendDot} style={{ backgroundColor: color }} />
      <span className={styles.legendText}>{label}</span>
    </div>
  );
}
