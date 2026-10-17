import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
} from "react";

const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, "")}`;

type ProjectCategory = "Уроки" | "Авторская музыка" | "Выступления";

type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  year: string;
  summary: string;
  role: string;
  result: string;
  image: string;
  imageAlt: string;
};

type ModalState =
  | { kind: "project"; project: Project }
  | { kind: "video" };

const projects: Project[] = [
  {
    id: "01",
    title: "Индивидуальные занятия",
    category: "Уроки",
    year: "3 года преподавания",
    summary:
      "Помогаю ученикам освоиться с инструментом, разобраться в музыке и найти собственное звучание.",
    role: "Преподавание игры на гитаре и индивидуальный подход к каждому ученику.",
    result:
      "Три года делюсь опытом и помогаю другим открывать для себя гитару.",
    image: "/images/artemiy-guitar.jpg",
    imageAlt: "Артемий с гитарой",
  },
  {
    id: "02",
    title: "Авторская музыка",
    category: "Авторская музыка",
    year: "Песни и мелодии",
    summary:
      "Пишу песни и мелодии, исследую новые гармонии и нестандартные гитарные строи.",
    role: "Автор музыки и текстов, поиск собственного звучания.",
    result:
      "DADGAD и CGCEBE помогают услышать знакомый инструмент по-новому.",
    image: "/images/artemiy-portrait.jpg",
    imageAlt: "Артемий играет на гитаре на сцене",
  },
  {
    id: "03",
    title: "Выступления в коллективах",
    category: "Выступления",
    year: "Живая сцена",
    summary:
      "Выступаю с коллективами и превращаю написанные мелодии в живое общее звучание.",
    role: "Гитарист и участник музыкальных коллективов.",
    result:
      "Сцена, репетиции и работа с другими музыкантами стали важной частью моего пути.",
    image: "/images/artemiy-live.jpg",
    imageAlt: "Артемий выступает на сцене",
  },
];

const filters = ["Все", "Уроки", "Авторская музыка", "Выступления"] as const;
const performanceVideo = asset("/images/video_2026-10-17_14-57-48.mp4");

const scannedDiplomas = [
  {
    type: "Интеллектуальный конкурс",
    caption: "Победа на молодёжном слёте Подольского благочиния",
    alt: "Грамота победителя интеллектуального конкурса молодёжного слёта Подольского благочиния",
  },
  {
    type: "Благодарственное письмо",
    caption: "За активное участие в жизни колледжа · 2024",
    alt: "Благодарственное письмо за активное участие в жизни колледжа",
    scan: 8,
  },
  {
    type: "Студенческая жизнь",
    caption: "За активное участие в жизни колледжа и городских мероприятиях · 2026",
    alt: "Грамота за активное участие в жизни колледжа и городских мероприятиях",
  },
  {
    type: "Студенческая весна · 2025",
    caption: "III место · вокальное направление",
    alt: "Грамота за третье место в конкурсе вокалистов фестиваля «Студенческая весна»",
  },
  {
    type: "Общественная деятельность",
    caption: "За активное участие в жизни колледжа и молодёжных движениях · 2025",
    alt: "Грамота за активное участие в жизни колледжа, молодёжных движениях и городских мероприятиях",
  },
  {
    type: "Универсиада студентов · 2025",
    caption: "I место · спортивное метание ножа",
    alt: "Грамота за первое место в соревнованиях по спортивному метанию ножа",
  },
  {
    type: "Студенческая весна · 2026",
    caption: "Лауреат I степени · муниципальный этап, инструментальное направление",
    alt: "Диплом лауреата первой степени муниципального этапа фестиваля «Студенческая весна Подмосковья»",
  },
  {
    type: "Студенческая весна · 2026",
    caption: "Лауреат I степени · инструментальное направление",
    alt: "Диплом лауреата первой степени фестиваля «Студенческая весна Подмосковья»",
    landscape: true,
    wide: true,
    scan: 2,
  },
];

function saveEditableText(field: string, element: HTMLElement) {
  const text = element.innerText.trim();

  try {
    window.localStorage.setItem(`artemiy-portfolio:${field}`, text);
  } catch {
    // Keep the text editable if browser storage is unavailable.
  }

  document.querySelectorAll<HTMLElement>("[data-editable]").forEach((item) => {
    if (item.dataset.editable === field && item !== element) {
      item.innerText = text;
    }
  });

}

type EditableTextProps = {
  as?: ElementType;
  field: string;
  editMode: boolean;
  className?: string;
  htmlId?: string;
  children: ReactNode;
};

function EditableText({
  as: Tag = "span",
  field,
  editMode,
  className = "",
  htmlId,
  children,
}: EditableTextProps) {
  const editableRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(`artemiy-portfolio:${field}`);
      if (saved !== null && editableRef.current) editableRef.current.innerText = saved;
    } catch {
      // Keep the demo copy if browser storage is unavailable.
    }
  }, [field]);

  function handleBlur(event: FocusEvent<HTMLElement>) {
    saveEditableText(field, event.currentTarget);
  }

  return (
    <Tag
      className={`editable-text ${className}`}
      ref={editableRef}
      id={htmlId}
      data-editable={field}
      contentEditable={editMode}
      suppressContentEditableWarning
      spellCheck={editMode}
      role={editMode ? "textbox" : undefined}
      aria-label={editMode ? "Нажмите, чтобы изменить текст" : undefined}
      onBlur={handleBlur}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        if (editMode) {
          event.stopPropagation();
          if (event.currentTarget.closest("a, button")) event.preventDefault();
          event.currentTarget.focus();
        }
      }}
    >
      {children}
    </Tag>
  );
}

function ArrowIcon({ diagonal = true }: { diagonal?: boolean }) {
  return diagonal ? (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M5 15 15 5M6 5h9v9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="m9 6 10 6-10 6V6Z" fill="currentColor" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="m12.8 4.2 3 3M4 16l3.3-.7L16 6.6a1.8 1.8 0 0 0-2.6-2.6l-8.7 8.7L4 16Z" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path
        d="M6 7V3.8h8V7M5.2 14H4a1.5 1.5 0 0 1-1.5-1.5v-3A1.5 1.5 0 0 1 4 8h12a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 16 14h-1.2M6 11.5h8v5H6v-5Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="14.4" cy="10.5" r=".7" fill="currentColor" />
    </svg>
  );
}

function MenuIcon({ close = false }: { close?: boolean }) {
  return close ? (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M3 6.5h14M3 13.5h14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function getVideoEmbedUrl(value: string) {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : "";
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id =
        url.searchParams.get("v") ||
        url.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : "";
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = url.pathname.match(/\/(?:video\/)?(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}` : "";
    }
  } catch {
    return "";
  }

  return "";
}

export default function App() {
  const [editMode, setEditMode] = useState(false);
  const [showAllDiplomas, setShowAllDiplomas] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("Все");
  const [modal, setModal] = useState<ModalState | null>(null);
  const [videoInput, setVideoInput] = useState("");
  const [videoEmbed, setVideoEmbed] = useState("");
  const [videoError, setVideoError] = useState(false);

  const visibleProjects =
    activeFilter === "Все"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  useEffect(() => {
    const restoreSavedText = () => {
      document.querySelectorAll<HTMLElement>("[data-editable]").forEach((item) => {
        const field = item.dataset.editable;
        if (!field) return;

        try {
          const saved = window.localStorage.getItem(`artemiy-portfolio:${field}`);
          if (saved !== null) item.innerText = saved;
        } catch {
          // Ignore unavailable local storage and keep the demo copy.
        }
      });

      try {
        const storedVideo = window.localStorage.getItem("artemiy-portfolio:video-url") ?? "";
        setVideoInput(storedVideo);
        setVideoEmbed(getVideoEmbedUrl(storedVideo));
      } catch {
        // Video can still be entered for the current session.
      }
    };

    restoreSavedText();
  }, []);

  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled((current) => {
        const next = window.scrollY > 28;
        return current === next ? current : next;
      });

      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = pageHeight > 0 ? window.scrollY / pageHeight : 0;
      const bar = document.querySelector<HTMLElement>(".scroll-progress");
      if (bar) bar.style.transform = `scaleX(${progress})`;
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            activeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [showAllDiplomas]);

  useEffect(() => {
    if (!modal) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModal(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [modal]);

  function openVideoModal() {
    setVideoError(false);
    setModal({ kind: "video" });
  }

  function saveVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const embedUrl = getVideoEmbedUrl(videoInput);

    if (!embedUrl) {
      setVideoError(true);
      return;
    }

    setVideoError(false);
    setVideoEmbed(embedUrl);
    try {
      window.localStorage.setItem("artemiy-portfolio:video-url", videoInput.trim());
    } catch {
      // The embedded video remains available for the current session.
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const navigation = [
    { label: "История", href: "#about" },
    { label: "Учёба", href: "#education" },
    { label: "Достижения", href: "#achievements" },
    { label: "Дипломы", href: "#diplomas" },
    { label: "Музыка", href: "#projects" },
    { label: "Контакт", href: "#contact" },
  ];

  return (
    <div className={`portfolio-app${editMode ? " edit-mode" : ""}`}>
      <div className="scroll-progress" aria-hidden="true" />

      <header className={`site-header${isScrolled ? " is-scrolled" : ""}`}>
        <div className="header-inner">
          <a className="brand" href="#top" onClick={closeMenu} aria-label="В начало страницы">
            <span className="brand-mark">A.</span>
            <span className="brand-copy">
              <span>Артемий Баранов</span>
              <small>УЧЁБА · ИССЛЕДОВАНИЯ · МУЗЫКА</small>
            </span>
          </a>

          <nav className={`main-nav${menuOpen ? " is-open" : ""}`} aria-label="Основная навигация">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-tools">
            {editMode && <span className="edit-hint">Нажмите на текст, чтобы изменить</span>}
            <button
              className={`header-tool edit-toggle${editMode ? " is-active" : ""}`}
              type="button"
              onClick={() => setEditMode((current) => !current)}
              aria-pressed={editMode}
              aria-label={editMode ? "Завершить редактирование" : "Редактировать текст"}
            >
              <EditIcon />
              <span>{editMode ? "Готово" : "Редактировать"}</span>
            </button>
            <button className="header-tool print-toggle" type="button" onClick={() => window.print()}>
              <PrintIcon />
              <span>PDF</span>
            </button>
            <button
              className="menu-toggle"
              type="button"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MenuIcon close={menuOpen} />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section" id="top" aria-labelledby="hero-title">
          <div className="hero-image" aria-hidden="true" style={{ backgroundImage: `url(${asset('/images/artemiy-stage.jpg')})` }} />
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-content page-width">
            <p className="hero-eyebrow hero-enter hero-enter-1">
              <span className="eyebrow-mark" /> 18 ЛЕТ · СТУДЕНТ · АВТОР ИССЛЕДОВАНИЙ · МУЗЫКАНТ
            </p>
            <EditableText as="h1" field="profile-name" editMode={editMode} className="hero-name hero-enter hero-enter-2">
              Артемий<br />Баранов
            </EditableText>
            <p className="hero-position hero-enter hero-enter-3">
              <EditableText field="story-profile-role" editMode={editMode}>
                Юриспруденция · информационная безопасность · музыка
              </EditableText>
            </p>
            <EditableText as="p" field="story-hero-summary" editMode={editMode} className="hero-summary hero-enter hero-enter-3">
              Учёба, исследования и музыка складываются в историю, которая всё ещё пишется.
            </EditableText>
            <div className="hero-actions hero-enter hero-enter-4">
              <a className="button-primary" href="#about">
                Пройти по истории <ArrowIcon diagonal={false} />
              </a>
              <button className="button-text-light" type="button" onClick={openVideoModal}>
                <span className="button-play"><PlayIcon /></span>
                Видео выступления
              </button>
            </div>
          </div>
          <a className="hero-scroll" href="#about" aria-label="Прокрутить к истории Артемия">
            <span /> Листать историю
          </a>
        </section>

        <section className="about-section section-pad" id="about" aria-labelledby="about-title">
          <div className="page-width">
            <div className="section-kicker reveal">
              <span>01</span>
                <span>МОЯ ИСТОРИЯ</span>
            </div>
            <div className="about-heading reveal">
              <EditableText as="h2" field="story-heading" editMode={editMode} className="display-heading" >
                Несколько интересов. Одна личная история.
              </EditableText>
            </div>
            <div className="about-grid">
              <div className="about-copy reveal">
                <EditableText as="p" field="story-copy-primary" editMode={editMode} className="about-lead">
                  Мне 18 лет, и мой путь не помещается в одну профессию. Я учусь, исследую право и технологии, пишу музыку и не хочу останавливаться на одном направлении.
                </EditableText>
                <EditableText as="p" field="story-copy-secondary" editMode={editMode} className="about-secondary">
                  Гитара со мной с семи лет: я пишу музыку, выступаю и преподаю. Сегодня рядом с творчеством в моей жизни — дисциплина, интерес к точным наукам и желание понять, как устроен мир вокруг.
                </EditableText>
                <div className="about-principle">
                  <span className="principle-line" />
                  <EditableText as="p" field="story-principle" editMode={editMode}>
                    Учиться. Исследовать. Создавать.
                  </EditableText>
                </div>
              </div>
              <figure className="about-figure reveal">
                <img src={asset('/images/photo_2025-09-02_13-27-43.jpg')} alt="Артемий" />
                <figcaption>
                  <span>01 / В ПРОЦЕССЕ</span>
                    <EditableText field="story-photo-caption" editMode={editMode}>
                    Одна из глав моей истории
                  </EditableText>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="education-section section-pad" id="education" aria-labelledby="education-title">
          <div className="page-width">
            <div className="section-kicker reveal">
              <span>02</span>
              <span>УЧЁБА И ПРОФЕССИОНАЛЬНЫЙ ИНТЕРЕС</span>
            </div>
            <div className="education-heading reveal">
              <EditableText as="h2" field="education-heading" editMode={editMode} htmlId="education-title" className="display-heading">
                Два направления, чтобы понимать мир с разных сторон.
              </EditableText>
              <EditableText as="p" field="education-intro" editMode={editMode} className="section-intro">
                Сейчас я на третьем курсе и развиваюсь сразу в двух областях.
              </EditableText>
            </div>
            <div className="education-paths">
              <article className="education-path reveal">
                <span className="education-index">01 / ПРАВО</span>
                <div>
                  <span className="education-year">3 КУРС</span>
                  <EditableText as="h3" field="education-law" editMode={editMode}>
                    Юриспруденция
                  </EditableText>
                </div>
              </article>
              <article className="education-path reveal">
                <span className="education-index">02 / ТЕХНОЛОГИИ</span>
                <div>
                  <span className="education-year">3 КУРС</span>
                  <EditableText as="h3" field="education-security" editMode={editMode}>
                    Обеспечение информационной безопасности автоматизированных систем
                  </EditableText>
                </div>
              </article>
              <div className="scholarship-note reveal">
                <div>
                  <span>ОТМЕТКА НА МОЁМ ПУТИ</span>
                  <EditableText as="p" field="education-scholarship" editMode={editMode}>
                    Получал государственную стипендию.
                  </EditableText>
                </div>
              </div>
              <div className="scholarship-note council-note reveal">
                <div>
                  <span>СТУДЕНЧЕСКОЕ САМОУПРАВЛЕНИЕ</span>
                  <EditableText as="p" field="education-council" editMode={editMode}>
                    Активный участник студсовета; на третьем курсе стал заместителем председателя.
                  </EditableText>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="projects-section section-pad" id="projects" aria-labelledby="projects-title">
          <div className="page-width">
            <div className="section-kicker reveal">
              <span>03</span>
                <span>ТВОРЧЕСКАЯ ГЛАВА</span>
            </div>
            <div className="projects-heading reveal">
              <EditableText as="h2" field="story-music-heading" editMode={editMode} className="display-heading" >
                Музыка — важная часть моей истории.
              </EditableText>
              <EditableText as="p" field="story-music-intro" editMode={editMode} className="section-intro">
                Играю с семи лет: пишу песни, преподаю и выступаю с коллективами.
              </EditableText>
            </div>

            <div className="project-filters" role="tablist" aria-label="Фильтр проектов">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={activeFilter === filter ? "is-active" : ""}
                  onClick={() => setActiveFilter(filter)}
                  role="tab"
                  aria-selected={activeFilter === filter}
                >
                  {filter}
                  {filter === "Все" && <span className="filter-count">03</span>}
                </button>
              ))}
            </div>

            <div className="project-list">
              {visibleProjects.map((project) => (
                <button
                  className="project-row reveal"
                  key={project.id}
                  type="button"
                  onClick={() => setModal({ kind: "project", project })}
                  aria-label={`Подробнее о проекте: ${project.title}`}
                >
                  <span className="project-number">{project.id}</span>
                  <span className="project-main">
                    <EditableText as="span" field={`project-${project.id}-title`} editMode={editMode} className="project-title">
                      {project.title}
                    </EditableText>
                    <EditableText as="span" field={`project-${project.id}-meta`} editMode={editMode} className="project-category">
                      {project.category} · {project.year}
                    </EditableText>
                  </span>
                  <EditableText as="span" field={`project-${project.id}-summary`} editMode={editMode} className="project-summary">
                    {project.summary}
                  </EditableText>
                  <span className="project-arrow"><ArrowIcon /></span>
                </button>
              ))}
            </div>
            <p className="projects-note reveal">Выберите направление, чтобы узнать больше</p>
          </div>
        </section>

        <section className="achievements-section section-pad" id="achievements" aria-labelledby="achievements-title">
          <div className="page-width">
            <div className="section-kicker section-kicker-light reveal">
              <span>04</span>
              <span>ИССЛЕДОВАНИЯ И РЕЗУЛЬТАТЫ</span>
            </div>
            <div className="awards-heading reveal">
              <EditableText as="h2" field="story-achievements-heading" editMode={editMode} className="display-heading" >
                Любознательность превращается в результат.
              </EditableText>
              <EditableText as="p" field="story-achievements-intro" editMode={editMode} className="awards-intro">
                Научная работа, академические достижения и годы музыкальной практики.
              </EditableText>
            </div>

            <div className="awards-content">
              <div className="timeline-list">
                <article className="timeline-entry reveal">
                  <div>
                    <EditableText as="h3" field="story-award-scholarship-title" editMode={editMode}>
                      Государственная стипендия
                    </EditableText>
                    <EditableText as="p" field="story-award-scholarship-copy" editMode={editMode}>
                      Получал государственную стипендию во время учёбы.
                    </EditableText>
                  </div>
                </article>
                <article className="timeline-entry reveal">
                  <div>
                    <EditableText as="h3" field="story-award-article-title" editMode={editMode}>
                      1 место · научная работа
                    </EditableText>
                    <EditableText as="p" field="story-award-article-copy" editMode={editMode}>
                      Секция «Технические науки», VII Международный научно-исследовательский конкурс «Лучшие студенческие работы» · 2026.
                    </EditableText>
                    <a className="timeline-resource" href={asset('/images/artemiy-scientific-diploma.jpg')} target="_blank" rel="noreferrer">
                      Открыть диплом <ArrowIcon />
                    </a>
                  </div>
                </article>
                <article className="timeline-entry reveal">
                  <div>
                    <EditableText as="h3" field="story-award-olympiad-title" editMode={editMode}>
                      Всероссийская олимпиада «Ориентир развития"
                    </EditableText>
                    <EditableText as="p" field="story-award-olympiad-copy" editMode={editMode}>
                      Центр тестирования и олимпиад «Ориентир развития» · возможность международного участия · дипломы и итоговый опыт.
                    </EditableText>
                  </div>
                </article>
                <article className="timeline-entry reveal">
                  <div>
                    <EditableText as="h3" field="story-award-music-title" editMode={editMode}>
                      Студенческая весна
                    </EditableText>
                    <EditableText as="p" field="story-award-music-copy" editMode={editMode}>
                      Первое и второе места в инструментальном жанре.
                    </EditableText>
                  </div>
                </article>
                <article className="timeline-entry reveal">
                  <div>
                    <EditableText as="h3" field="story-award-teaching-title" editMode={editMode}>
                      Преподавание гитары
                    </EditableText>
                    <EditableText as="p" field="story-award-teaching-copy" editMode={editMode}>
                      Делюсь опытом и помогаю ученикам развиваться в музыке.
                    </EditableText>
                  </div>
                </article>
              </div>
              <figure className="awards-photo reveal">
                <img src={asset('/images/artemiy-mokit-award.jpeg')} alt="Артемий получает грамоту в колледже" />
              </figure>
            </div>
          </div>
        </section>

        <section className="diploma-gallery section-pad" id="diplomas" aria-labelledby="diplomas-title">
          <div className="page-width">
            <div className="section-kicker reveal">
              <span>05</span>
              <span>ДОКУМЕНТЫ И ПОДТВЕРЖДЕНИЯ</span>
            </div>
            <div className="diploma-heading reveal">
              <EditableText as="h2" field="diplomas-heading" editMode={editMode} htmlId="diplomas-title" className="display-heading">
                За каждой наградой стоит работа.
              </EditableText>
              <EditableText as="p" field="diplomas-intro" editMode={editMode} className="section-intro">
                Дипломы и документы, подтверждающие научные и учебные достижения.
              </EditableText>
            </div>
            <div className="diploma-grid" id="diploma-grid">
              <figure className="diploma-item reveal">
                <a className="diploma-image-link" href={asset('/images/artemiy-scientific-diploma.jpg')} target="_blank" rel="noreferrer" aria-label="Открыть диплом за первое место в научном конкурсе">
                  <div className="diploma-image">
                    <img src={asset('/images/artemiy-scientific-diploma.jpg')} alt="Диплом Артемия Баранова за первое место в секции «Технические науки»" loading="lazy" />
                  </div>
                </a>
                <figcaption>
                  <EditableText as="span" field="diploma-1-type" editMode={editMode}>Научный конкурс</EditableText>
                  <EditableText as="p" field="diploma-1-caption" editMode={editMode}>1 место · «Лучшие студенческие работы — 2026»</EditableText>
                </figcaption>
              </figure>
              <figure className="diploma-item reveal">
                <a className="diploma-image-link" href={asset('/images/artemiy-publication-certificate.jpg')} target="_blank" rel="noreferrer" aria-label="Открыть справку о публикации статьи">
                  <div className="diploma-image">
                    <img src={asset('/images/artemiy-publication-certificate.jpg')} alt="Справка о публикации научной статьи Артемия Баранова" loading="lazy" />
                  </div>
                </a>
                <figcaption>
                  <EditableText as="span" field="diploma-2-type" editMode={editMode}>Публикация статьи</EditableText>
                  <EditableText as="p" field="diploma-2-caption" editMode={editMode}>Работа о цифровой подписи опубликована в сборнике конкурса.</EditableText>
                </figcaption>
              </figure>
              <figure className="diploma-item reveal">
                <a className="diploma-image-link" href={asset('/images/artemiy-olympiad-diploma.jpg')} target="_blank" rel="noreferrer" aria-label="Открыть диплом второй степени по олимпиаде">
                  <div className="diploma-image">
                    <img src={asset('/images/artemiy-olympiad-diploma.jpg')} alt="Диплом II степени Артемия Баранова во Всероссийской олимпиаде" loading="lazy" />
                  </div>
                </a>
                <figcaption>
                  <EditableText as="span" field="diploma-3-type" editMode={editMode}>Всероссийская олимпиада</EditableText>
                  <EditableText as="p" field="diploma-3-caption" editMode={editMode}>Диплом II степени · «Ориентир развития»</EditableText>
                </figcaption>
              </figure>
              {(showAllDiplomas ? scannedDiplomas : []).map((diploma, index) => {
                const image = `/images/diploma-scan-${String(diploma.scan ?? index + 1).padStart(2, "02")}.jpg`;
                const number = index + 4;

                return (
                  <figure className={`diploma-item reveal${diploma.landscape ? " diploma-item-landscape" : ""}${diploma.wide ? " diploma-item-wide" : ""}`} key={image}>
                    <a className="diploma-image-link" href={asset(image)} target="_blank" rel="noreferrer" aria-label={`Открыть документ: ${diploma.type}`}>
                      <div className="diploma-image">
                        <img src={asset(image)} alt={diploma.alt} loading="lazy" />
                      </div>
                    </a>
                    <figcaption>
                      <EditableText as="span" field={`diploma-${number}-type`} editMode={editMode}>{diploma.type}</EditableText>
                      <EditableText as="p" field={`diploma-${number}-caption`} editMode={editMode}>{diploma.caption}</EditableText>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
            <button
              className="diploma-toggle"
              type="button"
              aria-expanded={showAllDiplomas}
              aria-controls="diploma-grid"
              onClick={() => setShowAllDiplomas((showing) => !showing)}
            >
              {showAllDiplomas ? "Свернуть" : "Показать больше"}
              <span aria-hidden="true">{showAllDiplomas ? "−" : "+"}</span>
            </button>
          </div>
        </section>

        <section className="quote-section section-pad" id="interview" aria-labelledby="quote-title">
          <div className="page-width quote-inner reveal">
            <div className="section-kicker">
              <span>06</span>
              <span>КОЛЛЕДЖ МОКИТ · МОЙ ОПЫТ</span>
            </div>
            <blockquote id="quote-title">
              <span className="quote-mark">“</span>
              <EditableText as="span" field="interview-quote" editMode={editMode}>
                МОКИТ помог мне стать тем, кто я есть.
              </EditableText>
            </blockquote>
            <div className="college-experience">
              <div className="college-story-row">
                <EditableText as="p" field="college-story-primary" editMode={editMode}>
                  Колледж стал важной частью моего становления — не только как музыканта, но и как человека. Здесь я научился не только учиться, но и проявлять себя в разных форматах: в творчестве, в работе в команде и в общественной жизни.
                </EditableText>
                <figure className="college-photo college-photo-group">
                  <img src={asset('/images/artemiy-mokit-group.jpeg')} alt="Студенты МОКИТа вместе в аудитории" />
                  <figcaption>Люди, с которыми росло творчество</figcaption>
                </figure>
              </div>
              <div className="college-story-row">
                <EditableText as="p" field="college-story-secondary" editMode={editMode}>
                  В МОКИТе у меня появилось пространство для творческого развития: я участвовал в мероприятиях, выступал на сцене и учился находить себя в разных ролях.
                </EditableText>
                <figure className="college-photo college-photo-award">
                  <img src={asset('/images/photo_2025-10-02_16-21-32.jpg')} alt="Артемий играет на гитаре перед аудиторией на мероприятии в колледже" />
                  <figcaption>Музыкальное выступление в колледже</figcaption>
                </figure>
              </div>
            </div>
            <div className="quote-credit">
              <span className="quote-rule" />
              <div>
                <EditableText as="span" field="interview-source" editMode={editMode}>
                  Артемий Баранов
                </EditableText>
                <EditableText as="span" field="interview-publication" editMode={editMode}>
                  МОКИТ · важная часть моего пути
                </EditableText>
              </div>
              <a href="#media" className="quote-link">
                Моя музыка <ArrowIcon />
              </a>
            </div>
          </div>
        </section>

        <section className="media-section section-pad" id="media" aria-labelledby="media-title">
          <div className="page-width">
            <div className="section-kicker reveal">
              <span>07</span>
              <span>МУЗЫКА В ДВИЖЕНИИ</span>
            </div>
            <div className="media-heading reveal">
              <EditableText as="h2" field="media-heading" editMode={editMode} className="display-heading" >
                От первых нот до сцены.
              </EditableText>
              <EditableText as="p" field="media-intro" editMode={editMode} className="section-intro">
                Гитара, живой звук и энергия совместного выступления.
              </EditableText>
            </div>

            <div className="photo-grid">
              <figure className="photo-figure photo-large reveal">
                <div className="photo-frame">
                  <img src={asset('/images/artemiy-band.jpg')} alt="Артемий играет с музыкальным коллективом" />
                </div>
                <figcaption>
                  <EditableText field="media-photo-1" editMode={editMode}>Музыка рождается вместе · выступление коллектива</EditableText>
                  <span>01 / 02</span>
                </figcaption>
              </figure>
              <figure className="photo-figure photo-small reveal">
                <div className="photo-frame">
                  <img src={asset('/images/artemiy-live.jpg')} alt="Артемий играет на сцене" />
                </div>
                <figcaption>
                  <EditableText field="media-photo-2" editMode={editMode}>Когда музыка звучит вместе</EditableText>
                  <span>02 / 02</span>
                </figcaption>
              </figure>
            </div>

            <div className="video-panel reveal">
              <div className="video-panel-content">
                <span className="video-label">ЖИВОЙ ЗВУК</span>
                <EditableText as="h3" field="video-heading" editMode={editMode}>
                  Музыка на сцене
                </EditableText>
                <EditableText as="p" field="video-copy" editMode={editMode}>
                  Фрагмент живого выступления.
                </EditableText>
                <button type="button" className="video-open-button" onClick={openVideoModal}>
                  <span className="video-play-icon"><PlayIcon /></span>
                  <span>Смотреть видео</span>
                  <ArrowIcon />
                </button>
              </div>
              <span className="video-panel-index">VIDEO / 01</span>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="page-width contact-inner">
            <div className="section-kicker reveal">
              <span>08</span>
              <span>ПРОДОЛЖЕНИЕ ИСТОРИИ</span>
            </div>
            <div className="contact-grid reveal">
              <EditableText as="h2" field="contact-heading" editMode={editMode} htmlId="contact-title" className="contact-title">
                Давайте создадим что-нибудь вместе.
              </EditableText>
              <div className="contact-details">
                <EditableText as="p" field="story-contact-copy" editMode={editMode}>
                  Учёба, исследования и творчество продолжаются. Буду рад новым идеям и сотрудничеству.
                </EditableText>
                <a className="contact-email" href="mailto:tema.baranov_64@mail.ru">
                  tema.baranov_64@mail.ru
                  <ArrowIcon />
                </a>
              </div>
            </div>
            <footer className="site-footer">
              <a className="footer-top-link" href="#top">
                Наверх <span>↑</span>
              </a>
              <p>Артемий Баранов · учёба, исследования, музыка</p>
              <span>© 2026</span>
            </footer>
          </div>
        </section>
      </main>

      {modal && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setModal(null)}>
          <div
            className={`modal-dialog${modal.kind === "project" ? " project-dialog" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" onClick={() => setModal(null)} aria-label="Закрыть окно">
              <MenuIcon close />
            </button>

            {modal.kind === "project" && (
              <>
                <div className="project-dialog-image">
                  <img src={asset(modal.project.image)} alt={modal.project.imageAlt} />
                  <EditableText as="span" field={`project-${modal.project.id}-meta`} editMode={editMode}>
                    {modal.project.category} · {modal.project.year}
                  </EditableText>
                </div>
                <div className="project-dialog-copy">
                  <span className="modal-kicker">ПРОЕКТ / {modal.project.id}</span>
                  <EditableText
                    as="h2"
                    field={`project-${modal.project.id}-title`}
                    editMode={editMode}
                    htmlId="modal-title"
                  >
                    {modal.project.title}
                  </EditableText>
                  <EditableText as="p" field={`project-${modal.project.id}-detail-summary`} editMode={editMode}>
                    {modal.project.summary}
                  </EditableText>
                  <div className="project-detail-lines">
                    <div>
                      <span>Моя роль</span>
                      <EditableText as="p" field={`project-${modal.project.id}-role`} editMode={editMode}>
                        {modal.project.role}
                      </EditableText>
                    </div>
                    <div>
                      <span>Что получилось</span>
                      <EditableText as="p" field={`project-${modal.project.id}-result`} editMode={editMode}>
                        {modal.project.result}
                      </EditableText>
                    </div>
                  </div>
                </div>
              </>
            )}

            {modal.kind === "video" && (
              <div className="video-dialog-content">
                <span className="modal-kicker">ЖИВОЙ ЗВУК / АВТОРСКАЯ МУЗЫКА</span>
                <h2 id="modal-title">Запись выступления</h2>
                {videoEmbed ? (
                  <div className="video-embed-wrap">
                    <iframe
                      src={videoEmbed}
                      title="Видео-визитка"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="video-embed-wrap">
                    <video controls playsInline preload="metadata" poster={asset('/images/artemiy-live.jpg')}>
                      <source src={performanceVideo} type="video/mp4" />
                      Ваш браузер не поддерживает воспроизведение видео.
                    </video>
                  </div>
                )}
                <form className="video-url-form" onSubmit={saveVideo}>
                  <label htmlFor="video-url">Ссылка на YouTube или Vimeo</label>
                  <div className="video-input-row">
                    <input
                      id="video-url"
                      type="url"
                      value={videoInput}
                      onChange={(event) => {
                        setVideoInput(event.target.value);
                        setVideoError(false);
                      }}
                      placeholder="https://youtu.be/..."
                    />
                    <button type="submit">{videoEmbed ? "Обновить" : "Подключить"}</button>
                  </div>
                  {videoError && <p className="video-error">Введите действительную ссылку на видео YouTube или Vimeo.</p>}
                  <p className="video-form-note">Добавленная ссылка YouTube или Vimeo сохранится в этом браузере вместо видеозаписи.</p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
