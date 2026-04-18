--
-- PostgreSQL database dump
--

\restrict 2PJzzGD66EhSKP3DtalSlYrZ2BUQheo70aViMhkhbkoSIzQCHFumkH9QnocqQht

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: contact_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_info (
    id text DEFAULT 'main'::text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    address text NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.contact_info OWNER TO postgres;

--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_messages (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    phone character varying(50) NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.contact_messages OWNER TO postgres;

--
-- Name: contact_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_messages_id_seq OWNER TO postgres;

--
-- Name: contact_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_messages_id_seq OWNED BY public.contact_messages.id;


--
-- Name: course_pricing; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_pricing (
    course_slug text NOT NULL,
    price text NOT NULL,
    price_note text NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.course_pricing OWNER TO postgres;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id text NOT NULL,
    title text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    price text DEFAULT ''::text NOT NULL,
    duration text DEFAULT ''::text NOT NULL,
    image_url text DEFAULT ''::text NOT NULL,
    icon text DEFAULT '📚'::text NOT NULL,
    category text DEFAULT 'adults'::text NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    badge text DEFAULT ''::text,
    stats jsonb,
    topics jsonb,
    for_whom jsonb
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: faq_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faq_items (
    id text NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.faq_items OWNER TO postgres;

--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    phone character varying(50) NOT NULL,
    course character varying(255) NOT NULL,
    payment_method character varying(100) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: contact_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages ALTER COLUMN id SET DEFAULT nextval('public.contact_messages_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Data for Name: contact_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_info (id, phone, email, address, updated_at) FROM stdin;
main	0770 764 200\n0770 767 750\n0550 686 498	nooracademyalgeria@gmail.com	Hay Arroudj, Centre des Affaires Erriadh N°02 Chlef DZ، 02000	2026-04-07 21:20:36.292365
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_messages (id, name, phone, message, created_at) FROM stdin;
1	أحمد بن علي	0555 12 34 56	أريد الاستفسار عن دورة البكالوريا	2026-04-07 20:52:28.249971
2	أحمد بن علي	0555 12 34 56	أريد الاستفسار عن دورة البكالوريا	2026-04-07 20:52:32.172906
3	Mohammed Bouazdia 	0559463806	testzzzzzz	2026-04-07 20:53:34.092894
\.


--
-- Data for Name: course_pricing; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_pricing (course_slug, price, price_note, updated_at) FROM stdin;
bac	6,000 د.ج / شهرياً	يشمل السعر جميع المواد الثلاث — 6 ساعات أسبوعياً لمدة شهر كامل.	2026-04-07 19:06:19.290183
english	4,500 د.ج / شهرياً	4 ساعات أسبوعياً — يشمل المواد التعليمية ووصولاً لمكتبة رقمية.	2026-04-07 19:06:19.290183
robotics	5,000 د.ج / شهرياً	3 ساعات أسبوعياً — يشمل جميع مواد ومكونات الروبوت.	2026-04-07 19:06:19.290183
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, title, description, price, duration, image_url, icon, category, is_featured, sort_order, created_at, updated_at, badge, stats, topics, for_whom) FROM stdin;
bac	تحضير البكالوريا	منهج شامل ودقيق في الرياضيات والفيزياء والعلوم الطبيعية، مع متابعة فردية لكل طالب لضمان أعلى نتيجة ممكنة في امتحان البكالوريا.	6,000 د.ج / شهرياً	6 ساعة/أسبوع		📚	adults	f	0	2026-04-07 19:06:19.292381	2026-04-07 19:06:19.292381	شعبة العلوم والتقني رياضي	[{"label": "الصف الدراسي", "value": "السنة النهائية"}, {"label": "مواد البرنامج", "value": "3 مواد رئيسية"}, {"label": "تدريب مكثف", "value": "6 ساعة/أسبوع"}, {"label": "منهجية التعلم", "value": "تدريب تفاعلي"}]	[{"num": "01", "desc": "تغطية كاملة لمنهج الرياضيات بشعبتيه — من التحليل والجبر إلى الإحصاء والهندسة — مع حل مستفيض لامتحانات السنوات السابقة.", "tags": ["التحليل", "الجبر", "الهندسة", "الإحصاء"], "title": "الرياضيات"}, {"num": "02", "desc": "فهم عميق للمفاهيم الفيزيائية والكيميائية مع تمارين تطبيقية وتجارب عملية تساعد الطالب على استيعاب الدرس بسهولة.", "tags": ["الميكانيك", "الكهرباء", "الكيمياء العضوية", "الضوء"], "title": "الفيزياء والكيمياء"}, {"num": "03", "desc": "شرح وافٍ لمحاور بيولوجيا وجيولوجيا البكالوريا، مع مراجعة شاملة للوحدات الأكثر تكراراً في الامتحانات الرسمية.", "tags": ["البيولوجيا", "الجيولوجيا", "التشريح", "الخلية"], "title": "العلوم الطبيعية"}, {"num": "04", "desc": "تدريب مكثف على إدارة الوقت، وتقنيات الإجابة الصحيحة، ومحاكاة ظروف الامتحان الحقيقي لتعزيز الثقة بالنفس.", "tags": ["إدارة الوقت", "نمذجة الامتحانات", "ثقة بالنفس"], "title": "منهجية الامتحان"}]	["طلاب السنة النهائية ثانوي (شعبة العلوم أو التقني رياضي).", "من يريد تعزيز نتيجته ورفع معدله في البكالوريا.", "من يعاني من ثغرات في مادة الرياضيات أو الفيزياء.", "الطلاب الراغبون في تكملة دراستهم في كليات العلوم أو الهندسة."]
english	اللغة الإنجليزية	دورات مدروسة بعناية لتطوير مهارات المحادثة والكتابة والقراءة، مع مدرسين متخصصين ومحتوى حديث مناسب لجميع المستويات والأعمار.	4,500 د.ج / شهرياً	4 ساعة/أسبوع		🌍	adults	t	1	2026-04-07 19:06:19.292381	2026-04-07 19:06:19.292381	من مبتدئ إلى متقدم	[{"label": "الفئة المستهدفة", "value": "جميع الأعمار"}, {"label": "مسارات التعلم", "value": "4 مستويات"}, {"label": "تدريب منتظم", "value": "4 ساعة/أسبوع"}, {"label": "منهجية التعلم", "value": "محادثة + كتابة"}]	[{"num": "01", "desc": "تطوير مهارة الكلام بثقة والفهم الجيد للأصوات الإنجليزية، من خلال حوارات حية وتمثيل أدوار وتسجيلات صوتية أصيلة.", "tags": ["المحادثة", "النطق", "الاستماع", "الحوار"], "title": "المحادثة والاستماع"}, {"num": "02", "desc": "توسيع المخزون اللغوي وتحسين أسلوب الكتابة، بدءاً من الجملة البسيطة وصولاً إلى كتابة مقالات ورسائل احترافية.", "tags": ["الكتابة الإبداعية", "القراءة الموسعة", "المفردات"], "title": "القراءة والكتابة"}, {"num": "03", "desc": "تغطية شاملة لقواعد اللغة الإنجليزية (Grammar) بأسلوب مبسط وعملي، مع تطبيقات يومية تثبّت المعلومة.", "tags": ["الأزمنة", "الأفعال", "الجملة المركبة", "التراكيب"], "title": "القواعد اللغوية"}, {"num": "04", "desc": "تحضير للطلاب الراغبين في اجتياز اختبارات الكفاءة كـ IELTS وDELF، مع تقييم دوري وخطة شخصية مخصصة لكل طالب.", "tags": ["IELTS", "محاكاة اختبارات", "تحليل الأداء"], "title": "الإعداد للشهادات"}]	["الطلاب من جميع المراحل الذين يريدون تحسين نتائجهم المدرسية.", "المهنيون الراغبون في اللغة الإنجليزية للعمل أو السفر.", "من يريد الاستعداد لاختبارات الكفاءة الدولية.", "الأطفال والمبتدئون الذين يبدأون من الصفر."]
robotics	الروبوتيك للأطفال	برنامج تفاعلي وممتع يُعلّم الأطفال أساسيات البرمجة وتجميع الروبوتات بأسلوب لعبي، ينمّي التفكير المنطقي والإبداعي.	5,000 د.ج / شهرياً	3 ساعة/أسبوع		🤖	kids	t	0	2026-04-07 19:06:19.292381	2026-04-07 19:06:19.292381	للأعمار 8-14 سنة	[{"label": "الفئة العمرية", "value": "8-14 سنة"}, {"label": "وحدات البرنامج", "value": "4 وحدات"}, {"label": "جلسات عملية", "value": "3 ساعة/أسبوع"}, {"label": "منهجية التعلم", "value": "تعلم بالممارسة"}]	[{"num": "01", "desc": "تعلّم مبادئ البرمجة بطريقة بصرية وممتعة باستخدام Scratch وبيئات بصرية مناسبة للأعمار الصغيرة، دون الحاجة لخبرة سابقة.", "tags": ["Scratch", "المنطق البرمجي", "التسلسل", "الشرط"], "title": "أساسيات البرمجة"}, {"num": "02", "desc": "اكتشاف كيفية عمل الروبوتات من الداخل — تجميع القطع، توصيل الأسلاك، وفهم دور كل مكوّن في جعل الروبوت يتحرك ويستجيب.", "tags": ["المحركات", "الحساسات", "الهيكل", "الدوائر الكهربائية"], "title": "تجميع الروبوت"}, {"num": "03", "desc": "تحديات أسبوعية تُشجع الطفل على التفكير خارج الصندوق، العمل الجماعي، وإيجاد حلول إبداعية لمهام واقعية ومسلية.", "tags": ["حل المشكلات", "التفكير النقدي", "العمل الجماعي"], "title": "التفكير الإبداعي وحل المشكلات"}, {"num": "04", "desc": "في نهاية كل وحدة يصمّم الطفل ويُنفّذ مشروعاً كاملاً بنفسه، ويُقدّمه أمام زملائه، لبناء الثقة بالنفس وحب الابتكار.", "tags": ["مشروع نهائي", "العرض التقديمي", "الإبداع"], "title": "مشاريع عملية"}]	["الأطفال المهتمون بالتكنولوجيا والاكتشاف.", "من يريد تنمية التفكير المنطقي لدى أبنائه منذ الصغر.", "الأطفال الراغبون في تطوير مهارات القرن الـ21.", "من يبحث عن نشاط تعليمي ممتع ومفيد في وقت الفراغ."]
french	اللغة الفرنسية	دورة متكاملة لتعلم اللغة الفرنسية من الصفر حتى الاحتراف، مع مدرسين متخصصين ومحتوى حديث يناسب جميع الأعمار والمستويات.	4,000 د.ج / شهرياً	4 ساعة/أسبوع		🇫🇷	adults	f	2	2026-04-07 22:05:08.746537	2026-04-07 22:05:08.746537	من مبتدئ إلى متقدم	[{"label": "الفئة المستهدفة", "value": "جميع الأعمار"}, {"label": "مسارات التعلم", "value": "3 مستويات"}, {"label": "تدريب منتظم", "value": "4 ساعة/أسبوع"}, {"label": "منهجية التعلم", "value": "محادثة + كتابة"}]	[{"num": "01", "desc": "تعلّم التحدث بالفرنسية في المواقف اليومية من تعارف وتسوق وسفر، مع تدريبات صوتية ومحادثات حية مع المدرب.", "tags": ["التحية", "التعارف", "المحادثة اليومية", "النطق"], "title": "المحادثة اليومية"}, {"num": "02", "desc": "إتقان قواعد اللغة الفرنسية (Grammaire) من أزمنة وتصريفات وتراكيب جملة، بأسلوب مبسط مع تطبيقات عملية.", "tags": ["الأزمنة", "التصريف", "الجنس والعدد", "الجملة"], "title": "القواعد الأساسية"}, {"num": "03", "desc": "تطوير مهارة القراءة والكتابة من نصوص بسيطة إلى مقالات ورسائل رسمية، مع توسيع المفردات.", "tags": ["المفردات", "القراءة الموسعة", "الكتابة الرسمية"], "title": "القراءة والكتابة"}, {"num": "04", "desc": "تحضير لاجتياز اختبارات DELF وDELF Prim للحصول على شهادة دولية معتمدة في اللغة الفرنسية.", "tags": ["DELF", "DALF", "محاكاة اختبارات", "تقييم دوري"], "title": "الإعداد للشهادات"}]	["المبتدئون الراغبون في تعلم الفرنسية من الصفر.", "الطلاب الذين يدرسون الفرنسية في المدرسة ويريدون تقوية مستواهم.", "المهنيون الراغبون في تعلم الفرنسية للعمل أو السفر.", "من يريد التقدم لاختبارات DELF والحصول على شهادة دولية."]
\.


--
-- Data for Name: faq_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faq_items (id, question, answer, sort_order, updated_at) FROM stdin;
1	كيف يمكنني التسجيل في الدورات؟	يمكنك التسجيل بسهولة عبر تعبئة النموذج الإلكتروني الموجود في أسفل الصفحة، وسيقوم فريقنا بالتواصل معك لتأكيد التسجيل.	0	2026-04-07 19:06:19.294185
2	ما هي أوقات الدراسة؟	نوفر جداول مرنة تناسب جميع الطلاب، بما في ذلك فترات مسائية وعطلات نهاية الأسبوع.	1	2026-04-07 19:06:19.294185
3	ما هي الفئة العمرية لدورة الروبوتيك؟	دورة الروبوتيك مصممة خصيصاً للأطفال واليافعين الذين تتراوح أعمارهم بين 8 و 14 سنة.	2	2026-04-07 19:06:19.294185
4	ما هي طرق الدفع المتاحة؟	نقبل الدفع نقداً في مقر الأكاديمية، أو عبر التحويل البريدي (CCP).	3	2026-04-07 19:06:19.294185
5	هل تقدمون شهادات بعد إتمام الدورات؟	نعم، نقدم شهادات مشاركة معتمدة من الأكاديمية بعد إتمام دورات اللغات والروبوتيك.	4	2026-04-07 19:06:19.294185
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, name, phone, course, payment_method, status, created_at) FROM stdin;
1	Mohammedaaaaaaa 	0559463806	english	ccp	pending	2026-04-07 19:07:19.284046
\.


--
-- Name: contact_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_messages_id_seq', 3, true);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 1, true);


--
-- Name: contact_info contact_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_info
    ADD CONSTRAINT contact_info_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: course_pricing course_pricing_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_pricing
    ADD CONSTRAINT course_pricing_pkey PRIMARY KEY (course_slug);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: faq_items faq_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faq_items
    ADD CONSTRAINT faq_items_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict 2PJzzGD66EhSKP3DtalSlYrZ2BUQheo70aViMhkhbkoSIzQCHFumkH9QnocqQht

