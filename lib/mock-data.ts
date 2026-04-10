import type { Principal, Denomination, Church, Class, Teacher, Module, Book, Student, Session, Attendance, AttendanceRate, CriticalAlert, WeeklyTrend } from './types'

// ─── Records ────────────────────────────────────────────────────────────────

export const DENOMINATIONS: Denomination[] = [
  { id: 'd1', name: 'Qodesh Family Church',       abbreviation: 'QFC' },
  { id: 'd2', name: 'Loyalty House International', abbreviation: 'LHI' },
]

export const CHURCHES: Church[] = [
  // QFC
  { id: 'ch1', name: 'QFC Grace Chapel',       denominationId: 'd1' },
  { id: 'ch2', name: 'QFC Covenant Assembly',   denominationId: 'd1' },
  { id: 'ch3', name: 'QFC Glory Tabernacle',    denominationId: 'd1' },
  { id: 'ch4', name: 'QFC Faith Centre',        denominationId: 'd1' },
  // LHI
  { id: 'ch5', name: 'LHI Redemption House',    denominationId: 'd2' },
  { id: 'ch6', name: 'LHI Grace Cathedral',     denominationId: 'd2' },
  { id: 'ch7', name: 'LHI Victory Chapel',      denominationId: 'd2' },
  { id: 'ch8', name: 'LHI Emmanuel Assembly',   denominationId: 'd2' },
]

export const CLASSES: Class[] = [
  { id: 'cls1', name: 'Makarios', teacherId: 't1' },
  { id: 'cls2', name: 'Poimen',   teacherId: 't2' },
]

export const TEACHERS: Teacher[] = [
  { id: 't1', name: 'Pastor Emmanuel Asante'    },
  { id: 't2', name: 'Deaconess Grace Mensah'    },
  { id: 't3', name: 'Elder Philip Boateng'      },
  { id: 't4', name: 'Pastor Rebecca Owusu'      },
]

export const PRINCIPAL: Principal = {
  id: 'p1', name: 'Dr. Julian Vance',
  email: 'admin@school.com', password: 'admin123'
}

export const STUDENTS: Student[] = [
  // Makarios class (cls1)
  { id: 's1',  name: 'Kofi Asante',       classId: 'cls1', churchId: 'ch1', gender: 'male'   },
  { id: 's2',  name: 'Abena Mensah',      classId: 'cls1', churchId: 'ch5', gender: 'female' },
  { id: 's3',  name: 'Emmanuel Boateng',  classId: 'cls1', churchId: 'ch2', gender: 'male'   },
  { id: 's4',  name: 'Akua Adjei',        classId: 'cls1', churchId: 'ch6', gender: 'female' },
  { id: 's5',  name: 'Daniel Owusu',      classId: 'cls1', churchId: 'ch1', gender: 'male'   },
  { id: 's6',  name: 'Priscilla Frimpong',classId: 'cls1', churchId: 'ch7', gender: 'female' },
  { id: 's7',  name: 'Samuel Darko',      classId: 'cls1', churchId: 'ch3', gender: 'male'   },
  { id: 's8',  name: 'Ama Kusi',          classId: 'cls1', churchId: 'ch5', gender: 'female' },
  { id: 's9',  name: 'Benjamin Appiah',   classId: 'cls1', churchId: 'ch4', gender: 'male'   },
  { id: 's10', name: 'Esther Amoah',      classId: 'cls1', churchId: 'ch8', gender: 'female' },
  { id: 's11', name: 'Joshua Tetteh',     classId: 'cls1', churchId: 'ch2', gender: 'male'   },
  { id: 's12', name: 'Rebecca Asiedu',    classId: 'cls1', churchId: 'ch6', gender: 'female' },
  { id: 's13', name: 'Michael Ofori',     classId: 'cls1', churchId: 'ch1', gender: 'male'   },
  { id: 's14', name: 'Comfort Boadu',     classId: 'cls1', churchId: 'ch7', gender: 'female' },
  { id: 's15', name: 'Isaac Acheampong',  classId: 'cls1', churchId: 'ch3', gender: 'male'   },
  // Poimen class (cls2)
  { id: 's16', name: 'Elizabeth Nkrumah', classId: 'cls2', churchId: 'ch8', gender: 'female' },
  { id: 's17', name: 'Peter Amponsah',    classId: 'cls2', churchId: 'ch4', gender: 'male'   },
  { id: 's18', name: 'Mary Sarpong',      classId: 'cls2', churchId: 'ch5', gender: 'female' },
  { id: 's19', name: 'John Addae',        classId: 'cls2', churchId: 'ch2', gender: 'male'   },
  { id: 's20', name: 'Vivian Yeboah',     classId: 'cls2', churchId: 'ch6', gender: 'female' },
  { id: 's21', name: 'Philip Mensah',     classId: 'cls2', churchId: 'ch3', gender: 'male'   },
  { id: 's22', name: 'Felicia Owusu',     classId: 'cls2', churchId: 'ch7', gender: 'female' },
  { id: 's23', name: 'Stephen Kumi',      classId: 'cls2', churchId: 'ch1', gender: 'male'   },
  { id: 's24', name: 'Cynthia Mensah',    classId: 'cls2', churchId: 'ch8', gender: 'female' },
  { id: 's25', name: 'George Boateng',    classId: 'cls2', churchId: 'ch4', gender: 'male'   },
  { id: 's26', name: 'Patricia Adjei',    classId: 'cls2', churchId: 'ch5', gender: 'female' },
  { id: 's27', name: 'Andrew Frimpong',   classId: 'cls2', churchId: 'ch2', gender: 'male'   },
  { id: 's28', name: 'Irene Darko',       classId: 'cls2', churchId: 'ch6', gender: 'female' },
  { id: 's29', name: 'Solomon Kusi',      classId: 'cls2', churchId: 'ch1', gender: 'male'   },
  { id: 's30', name: 'Joanna Appiah',     classId: 'cls2', churchId: 'ch7', gender: 'female' },
]

export const MODULES: Module[] = [
  {
    id: 'm1', name: 'Loyalty', code: 'L',
    books: [
      { id: 'm1-b1',  name: 'Loyalty And Disloyalty',          chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b2',  name: 'Those Who Accuse You',             chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b3',  name: 'Those Who Are Proud',              chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b4',  name: 'Those Who Are Dangerous Sons',     chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b5',  name: 'Those Who Are Ignorant',           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b6',  name: 'Those Who Forget',                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b7',  name: 'Those Who Leave You',              chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b8',  name: 'Those Who Pretend',                chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b9',  name: 'One of You Is a Devil',            chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b10', name: 'Those Who Honour You',             chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b11', name: 'Those Who Are Offended',           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b12', name: 'Judas Who Is He?',                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b13', name: 'Those Who Are Mad',                chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b14', name: 'Why Loyalty',                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b15', name: 'Pillars Of Loyalty',               chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b16', name: 'Those Who Are Wolves',             chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b17', name: 'Those Who Are Slanderers',         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b18', name: 'Those Who Rebel',                  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b19', name: 'Those Who Make Shipwreck',         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm1-b20', name: 'Be Faithful unto Death',           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm2', name: 'The Call of God', code: 'COG',
    books: [
      { id: 'm2-b1',  name: 'Many Are Called',                           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b2',  name: 'Why Few Are Chosen',                        chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b3',  name: 'Attempt Great Things for God',              chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b4',  name: 'Tasters Or Partakers',                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b5',  name: "Can't You Do Just a Little Bit More",       chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b6',  name: 'Weeping and Gnashing',                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b7',  name: 'Ready @20',                                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b8',  name: 'Am I Good for Nothing',                     chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b9',  name: 'Fruitfulness',                              chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b10', name: 'Preparation of the Gospel',                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b11', name: 'The Privilege',                             chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b12', name: 'Going Deeper and Doing More',               chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b13', name: 'Ministerial Barrenness',                    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b14', name: 'Predestination',                            chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b15', name: 'Awake O Sleeper',                           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm2-b16', name: 'The Word of My Patience',                   chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm3', name: 'The Work of Ministry', code: 'WOM',
    books: [
      { id: 'm3-b1',  name: 'How You Can Make Full Proof of Your Ministry', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b2',  name: 'Rules of Full Time Ministry',                  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b3',  name: 'Rules of Church Work',                         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b4',  name: 'Losing Suffering Sacrificing and Dying',       chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b5',  name: 'It Is a Great Thing to Serve the Lord',        chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b6',  name: 'The Tree and Your Ministry',                   chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b7',  name: 'Not a Novice',                                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b8',  name: 'Seeing And Hearing',                           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b9',  name: 'If You Love the Lord',                         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b10', name: 'Bema Judgment and Justice',                    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b11', name: 'Stir It Up',                                   chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b12', name: 'Ministerial Ethics',                           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b13', name: 'The Big Secret ...Your Ministry Depends on Books', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm3-b14', name: 'The Tests of the Righteous',                   chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm4', name: 'Church Growth', code: 'CG',
    books: [
      { id: 'm4-b1', name: 'Church Growth',                    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm4-b2', name: 'Mega Church',                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm4-b3', name: 'Church Planting',                  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm4-b4', name: 'Double Mega Missionary Church',    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm4-b5', name: '1000 Micro Churches',              chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm4-b6', name: 'The Church Must Send',             chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm4-b7', name: 'Why Is This Church Not Working?',  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm4-b8', name: 'The Gift Of Governments',          chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm4-b9', name: 'Church Administration',            chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm5', name: 'The Anointing', code: 'A',
    books: [
      { id: 'm5-b1', name: 'Catch the Anointing',                    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm5-b2', name: 'Steps to the Anointing',                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm5-b3', name: 'Amplify Your Ministry',                  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm5-b4', name: 'Sweet Influences of the Anointing',      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm5-b5', name: 'The Anointing and the Presence',         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm5-b6', name: 'The Anointed and the Anointing',         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm5-b7', name: "Steps to God's Presence",                chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm5-b8', name: 'Flow in the Anointing',                  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm5-b9', name: 'The Love of the Spirit',                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm6', name: 'Evangelism', code: 'E',
    books: [
      { id: 'm6-b1', name: 'How You Can Preach Salvation',     chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm6-b2', name: 'Anagkazo',                         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm6-b3', name: 'Others',                           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm6-b4', name: 'Tell Them',                        chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm6-b5', name: 'Make Yourselves Saviours of Men',  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm6-b6', name: 'People Who Went to Hell',          chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm6-b7', name: 'Blood Power',                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm7', name: 'Pastoral Ministry', code: 'PM',
    books: [
      { id: 'm7-b1', name: 'Transform Your Pastoral Ministry',       chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm7-b2', name: 'What It Means to Become a Shepherd',     chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm7-b3', name: 'The Art of Shepherding',                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm7-b4', name: 'Lord, I Know You Need Somebody',         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm7-b5', name: 'Top Ten Mistakes that Pastors Make',     chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm7-b6', name: 'Laikos',                                 chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm8', name: 'Prayer', code: 'Pr',
    books: [
      { id: 'm8-b1', name: '100% Answered Prayer',                               chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm8-b2', name: 'Prayer Changes Things',                               chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm8-b3', name: 'How to Pray',                                         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm8-b4', name: 'Everything by Prayer Nothing Without Prayer',         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm8-b5', name: 'Flow Prayer Book',                                    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm8-b6', name: 'Prayer Opportunities',                                chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm9', name: 'Leadership', code: 'Le',
    books: [
      { id: 'm9-b1', name: 'The Art of Leadership',           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm9-b2', name: 'Wise as Serpents',                chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm9-b3', name: 'Wisdom is the Principal Thing',   chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm9-b4', name: 'The Determinants',                chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm10', name: 'The Arts', code: 'TA',
    books: [
      { id: 'm10-b1', name: 'The Art of Following',    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm10-b2', name: 'The Art of Leadership',   chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm10-b3', name: 'The Art of Shepherding',  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm10-b4', name: 'The Art of Hearing',      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm11', name: 'The Secrets', code: 'TS',
    books: [
      { id: 'm11-b1', name: 'Faith Secrets',        chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm11-b2', name: 'Hope Secrets',         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm11-b3', name: 'Victory Secrets',      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm11-b4', name: 'Enlargement Secrets',  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm12', name: 'Finances', code: 'Fi',
    books: [
      { id: 'm12-b1', name: 'He that Hath',                              chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm12-b2', name: 'Why Non-tithing Christians Become Poor',    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm12-b3', name: 'Labour to be Blessed',                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm12-b4', name: 'Neutralize the Curse',                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm13', name: 'Marriage', code: 'Ma',
    books: [
      { id: 'm13-b1', name: 'Model Marriage',                    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm13-b2', name: 'The Beauty, the Beast and the Pastor', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm13-b3', name: 'Jezebel, a Woman out of Order',     chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm13-b4', name: 'Ppikos Maso',                       chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm14', name: 'War', code: 'War',
    books: [
      { id: 'm14-b1', name: 'A Good General',    chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm14-b2', name: 'Now We Are at War', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm15', name: 'Demonology', code: 'D',
    books: [
      { id: 'm15-b1', name: 'Demons and How to Deal with Them', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm15-b2', name: 'Know Your Invisible Enemies',      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm16', name: 'Strong Christian', code: 'SC',
    books: [
      { id: 'm16-b1',  name: 'How to be Born Again and Avoid Hell',              chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b2',  name: 'How You Can be a Strong Christian',                chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b3',  name: 'Seven Great Principles',                           chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b4',  name: 'Read Your Bible',                                  chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b5',  name: 'Spiritual Dangers',                                chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b6',  name: 'How Can I Say Thanks',                             chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b7',  name: 'Daughter, You Can Make It',                        chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b8',  name: 'Backsliding',                                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b9',  name: 'Forgiveness Made Easy',                            chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b10', name: 'How You Can Have an Effective Quiet Time',         chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b11', name: 'Name it! Claim it! Take It!',                      chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm16-b12', name: 'Who is He that Overcometh the World?',             chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm17', name: 'Church History', code: 'CH',
    books: [
      { id: 'm17-b1', name: 'History of Lighthouse Chapel Vol. 1', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm17-b2', name: 'History of Lighthouse Chapel Vol. 2', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
      { id: 'm17-b3', name: 'History of Lighthouse Chapel Vol. 3', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
  {
    id: 'm18', name: 'Gift of Governance', code: 'GoG',
    books: Array.from({ length: 60 }, (_, i) => ({
      id: `m18-b${i + 1}`,
      name: `Chapter ${i + 1}`,
      chapters: ['Part 1', 'Part 2', 'Part 3'],
    })),
  },
  {
    id: 'm19', name: 'Bible Technology', code: 'BT',
    books: [
      { id: 'm19-b1', name: 'Bible Technology Materials', chapters: ['Chapter 1','Chapter 2','Chapter 3'] },
    ],
  },
]

// ─── Date helpers ─────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0]
function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export const SESSIONS: Session[] = [
  // Makarios class (cls1) — all sessions taught by t1
  { id: 'ses1',  classId: 'cls1', moduleId: 'm1', teacherId: 't1', date: daysAgo(28), bookId: 'm1-b1', chapterIndex: 0 },
  { id: 'ses2',  classId: 'cls1', moduleId: 'm1', teacherId: 't1', date: daysAgo(21), bookId: 'm1-b2', chapterIndex: 0 },
  { id: 'ses3',  classId: 'cls1', moduleId: 'm2', teacherId: 't1', date: daysAgo(20), bookId: 'm2-b1', chapterIndex: 0 },
  { id: 'ses4',  classId: 'cls1', moduleId: 'm2', teacherId: 't1', date: daysAgo(14), bookId: 'm2-b2', chapterIndex: 0 },
  { id: 'ses5',  classId: 'cls1', moduleId: 'm3', teacherId: 't1', date: daysAgo(13), bookId: 'm3-b1', chapterIndex: 0 },
  { id: 'ses6',  classId: 'cls1', moduleId: 'm1', teacherId: 't1', date: daysAgo(7),  bookId: 'm1-b3', chapterIndex: 0 },
  { id: 'ses7',  classId: 'cls1', moduleId: 'm2', teacherId: 't1', date: daysAgo(3),  bookId: 'm2-b3', chapterIndex: 0 },
  { id: 'ses8',  classId: 'cls1', moduleId: 'm3', teacherId: 't1', date: today,        bookId: 'm3-b2', chapterIndex: 0 },
  // Poimen class (cls2) — all sessions taught by t2
  { id: 'ses9',  classId: 'cls2', moduleId: 'm1', teacherId: 't2', date: daysAgo(27), bookId: 'm1-b1', chapterIndex: 0 },
  { id: 'ses10', classId: 'cls2', moduleId: 'm2', teacherId: 't2', date: daysAgo(20), bookId: 'm2-b1', chapterIndex: 0 },
  { id: 'ses11', classId: 'cls2', moduleId: 'm1', teacherId: 't2', date: daysAgo(18), bookId: 'm1-b2', chapterIndex: 0 },
  { id: 'ses12', classId: 'cls2', moduleId: 'm3', teacherId: 't2', date: daysAgo(13), bookId: 'm3-b1', chapterIndex: 0 },
  { id: 'ses13', classId: 'cls2', moduleId: 'm2', teacherId: 't2', date: daysAgo(11), bookId: 'm2-b2', chapterIndex: 0 },
  { id: 'ses14', classId: 'cls2', moduleId: 'm1', teacherId: 't2', date: daysAgo(6),  bookId: 'm1-b3', chapterIndex: 0 },
  { id: 'ses15', classId: 'cls2', moduleId: 'm3', teacherId: 't2', date: daysAgo(2),  bookId: 'm3-b2', chapterIndex: 0 },
  { id: 'ses16', classId: 'cls2', moduleId: 'm4', teacherId: 't2', date: today,        bookId: 'm4-b1', chapterIndex: 0 },
]

// ─── Attendance ───────────────────────────────────────────────────────────────

// Deterministic participation level from session+student ids (weighted toward L3/L4)
function deterministicLevel(sessionId: string, studentId: string): 1 | 2 | 3 | 4 {
  const hash = (sessionId + studentId).split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const levels: (1 | 2 | 3 | 4)[] = [3, 4, 3, 3, 4, 2, 3, 4, 3, 1, 3, 4]
  return levels[hash % levels.length]
}

function makeAttendance(
  sessionId: string,
  classId: string,
  absentStudentIds: string[]
): Attendance[] {
  const classStudents = STUDENTS.filter(s => s.classId === classId)
  return classStudents.map((s) => {
    const absent = absentStudentIds.includes(s.id)
    return {
      id: `att-${sessionId}-${s.id}`,
      sessionId,
      studentId: s.id,
      status: absent ? 'absent' : 'present',
      ...(absent ? {} : { participationLevel: deterministicLevel(sessionId, s.id) }),
    }
  })
}

export const ATTENDANCE: Attendance[] = [
  makeAttendance('ses1',  'cls1', ['s8', 's13']),
  makeAttendance('ses2',  'cls1', ['s4', 's11']),
  makeAttendance('ses3',  'cls1', ['s2', 's9']),
  makeAttendance('ses4',  'cls1', ['s7', 's15']),
  makeAttendance('ses5',  'cls1', ['s6', 's3']),
  makeAttendance('ses6',  'cls1', ['s6', 's14']),
  makeAttendance('ses7',  'cls1', ['s6', 's14', 's1']),
  makeAttendance('ses8',  'cls1', ['s6', 's14']),
  makeAttendance('ses9',  'cls2', ['s19', 's27']),
  makeAttendance('ses10', 'cls2', ['s16', 's24']),
  makeAttendance('ses11', 'cls2', ['s21', 's30']),
  makeAttendance('ses12', 'cls2', ['s18', 's25']),
  makeAttendance('ses13', 'cls2', ['s22', 's20']),
  makeAttendance('ses14', 'cls2', ['s22', 's17']),
  makeAttendance('ses15', 'cls2', ['s22', 's29']),
  makeAttendance('ses16', 'cls2', ['s22', 's26']),
].flat()

// ─── Runtime mutable arrays (for /attend submissions) ────────────────────────

const runtimeSessions: Session[] = []
const runtimeAttendance: Attendance[] = []
const runtimeClasses: Class[] = []
const runtimeDeletedClassIds = new Set<string>()
const runtimeStudentPatches: Record<string, Partial<Student>> = {}
const runtimeTeachers: Teacher[] = []
const runtimeDeletedTeacherIds = new Set<string>()
const runtimeChurches: Church[] = []
const runtimeDeletedChurchIds = new Set<string>()

// ─── Query Functions ──────────────────────────────────────────────────────────

// ─── Avatar helper ────────────────────────────────────────────────────────────

export function getStudentAvatarUrl(studentId: string): string {
  return `https://i.pravatar.cc/80?u=${studentId}`
}

export function getDenominations(): Denomination[] { return DENOMINATIONS }
export function getChurches(): Church[] {
  const base = CHURCHES.filter(c => !runtimeDeletedChurchIds.has(c.id))
  return [...base, ...runtimeChurches]
}
export function getChurchById(id: string): Church | undefined {
  if (runtimeDeletedChurchIds.has(id)) return undefined
  return runtimeChurches.find(c => c.id === id) ?? CHURCHES.find(c => c.id === id)
}
export function getChurchesByDenomination(denominationId: string): Church[] {
  return getChurches().filter(c => c.denominationId === denominationId)
}
export function getDenominationById(id: string): Denomination | undefined { return DENOMINATIONS.find(d => d.id === id) }

export function getClasses(): Class[] {
  const base = CLASSES.filter(c => !runtimeDeletedClassIds.has(c.id))
  return [...base, ...runtimeClasses]
}
export function getClassById(id: string): Class | undefined {
  if (runtimeDeletedClassIds.has(id)) return undefined
  return runtimeClasses.find(c => c.id === id) ?? CLASSES.find(c => c.id === id)
}

export function getTeachers(): Teacher[] {
  const base = TEACHERS.filter(t => !runtimeDeletedTeacherIds.has(t.id))
  return [...base, ...runtimeTeachers]
}
export function getAllTeachers(): Teacher[] { return getTeachers() }
export function getTeacherById(id: string): Teacher | undefined {
  if (runtimeDeletedTeacherIds.has(id)) return undefined
  return runtimeTeachers.find(t => t.id === id) ?? TEACHERS.find(t => t.id === id)
}

export function getModules(): Module[] { return MODULES }
export function getAllModules(): Module[] { return MODULES }
export function getModuleById(id: string): Module | undefined { return MODULES.find(m => m.id === id) }
// backward compat aliases
export function getCourses(): Module[] { return MODULES }
export function getCourseById(id: string): Module | undefined { return MODULES.find(m => m.id === id) }

export function getStudents(): Student[] {
  return STUDENTS.map(s => ({ ...s, ...runtimeStudentPatches[s.id] }))
}
export function getAllStudents(): Student[] { return getStudents() }
export function getStudentById(id: string): Student | undefined {
  return getStudents().find(s => s.id === id)
}
export function getStudentsByClass(classId: string): Student[] { return getStudents().filter(s => s.classId === classId) }
// backward compat
export function getStudentsForCourse(classId: string): Student[] { return getStudentsByClass(classId) }

export function getAllSessions(): Session[] { return [...SESSIONS, ...runtimeSessions] }
export function getSessionsByClass(classId: string): Session[] { return getAllSessions().filter(s => s.classId === classId) }
export function getSessionsByModule(moduleId: string): Session[] { return getAllSessions().filter(s => s.moduleId === moduleId) }
// backward compat
export function getSessionsForCourse(id: string): Session[] { return getSessionsByClass(id) }

export function getAllAttendance(): Attendance[] { return [...ATTENDANCE, ...runtimeAttendance] }
export function getAttendanceForSession(sessionId: string): Attendance[] {
  return getAllAttendance().filter(a => a.sessionId === sessionId)
}

export function getTeachersForModule(moduleId: string): { teacher: Teacher; classId: string }[] {
  const seen = new Set<string>()
  const results: { teacher: Teacher; classId: string }[] = []
  for (const session of getAllSessions()) {
    if (session.moduleId !== moduleId) continue
    const key = `${session.teacherId}-${session.classId}`
    if (seen.has(key)) continue
    seen.add(key)
    const teacher = getTeacherById(session.teacherId)
    if (teacher) results.push({ teacher, classId: session.classId })
  }
  return results
}

// ─── Attendance rate functions ────────────────────────────────────────────────

// Student attendance rate across all sessions in their class
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getAttendanceRate(studentId: string, _classIdOrCourseId?: string): AttendanceRate {
  const student = getStudents().find(s => s.id === studentId)
  if (!student) return { present: 0, total: 0, rate: 0 }
  const sessions = getSessionsByClass(student.classId)
  const att = getAllAttendance().filter(a => a.studentId === studentId && sessions.some(s => s.id === a.sessionId))
  const present = att.filter(a => a.status === 'present').length
  const total = att.length
  return { present, total, rate: total > 0 ? Math.round((present / total) * 100) : 0 }
}

// Class-level attendance rate (average across all students in the class)
export function getClassAttendanceRate(classId: string): number {
  const students = getStudentsByClass(classId)
  if (students.length === 0) return 0
  const rates = students.map(s => getAttendanceRate(s.id).rate)
  return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
}

// Per-book stats for a module: taught status + attendance rate per book
export function getModuleBookStats(moduleId: string): { book: Book; sessions: number; attendanceRate: number; taught: boolean }[] {
  const mod = getModuleById(moduleId)
  if (!mod) return []
  const allSessions = getAllSessions().filter(s => s.moduleId === moduleId)
  return mod.books.map(book => {
    const bookSessions = allSessions.filter(s => s.bookId === book.id)
    if (bookSessions.length === 0) return { book, sessions: 0, attendanceRate: 0, taught: false }
    let present = 0, total = 0
    for (const session of bookSessions) {
      const att = getAttendanceForSession(session.id)
      present += att.filter(a => a.status === 'present').length
      total += att.length
    }
    return { book, sessions: bookSessions.length, attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0, taught: true }
  })
}

// Module attendance rate (across all sessions for this module, across all classes)
export function getModuleAttendanceRate(moduleId: string): number {
  const sessions = getSessionsByModule(moduleId)
  if (sessions.length === 0) return 0
  let present = 0, total = 0
  for (const session of sessions) {
    const att = getAttendanceForSession(session.id)
    present += att.filter(a => a.status === 'present').length
    total += att.length
  }
  return total > 0 ? Math.round((present / total) * 100) : 0
}
// backward compat
export function getCourseAverageAttendance(id: string): number { return getModuleAttendanceRate(id) }

// Module completion rate: % of books that have been taught at least once
export function getModuleCompletionRate(moduleId: string): number {
  const mod = MODULES.find(m => m.id === moduleId)
  if (!mod || mod.books.length === 0) return 0
  const sessions = getAllSessions().filter(s => s.moduleId === moduleId)
  const taughtBookIds = new Set(sessions.map(s => s.bookId))
  return Math.round((taughtBookIds.size / mod.books.length) * 100)
}

// Institution-wide attendance rate
export function getInstitutionHealth(): number {
  const rates = getClasses().map(c => getClassAttendanceRate(c.id))
  return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
}
export function getSchoolwideAttendanceRate(): number { return getInstitutionHealth() }

// ─── Today counts ─────────────────────────────────────────────────────────────

export function getPresentTodayCount(): number {
  const todaySessions = getAllSessions().filter(s => s.date === today)
  let count = 0
  for (const session of todaySessions) {
    count += getAttendanceForSession(session.id).filter(a => a.status === 'present').length
  }
  return count
}

export function getAbsentTodayCount(): number {
  const todaySessions = getAllSessions().filter(s => s.date === today)
  let count = 0
  for (const session of todaySessions) {
    count += getAttendanceForSession(session.id).filter(a => a.status === 'absent').length
  }
  return count
}

// ─── Sessions this month ──────────────────────────────────────────────────────

export function getSessionsThisMonth(classId?: string): number {
  const now = new Date()
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const sessions = classId ? getSessionsByClass(classId) : getAllSessions()
  return sessions.filter(s => s.date.startsWith(monthStr)).length
}

// ─── Critical alerts ──────────────────────────────────────────────────────────

export function getCriticalAlerts(): CriticalAlert[] {
  const alerts: CriticalAlert[] = []
  for (const student of STUDENTS) {
    const sessions = getSessionsByClass(student.classId).sort((a, b) => b.date.localeCompare(a.date))
    const att = getAllAttendance().filter(a => a.studentId === student.id)
    let consecutive = 0
    for (const session of sessions) {
      const record = att.find(a => a.sessionId === session.id)
      if (record?.status === 'absent') consecutive++
      else break
    }
    if (consecutive >= 3) {
      const cls = CLASSES.find(c => c.id === student.classId)!
      alerts.push({
        studentId: student.id,
        studentName: student.name,
        classId: student.classId,
        className: cls.name,
        consecutiveAbsences: consecutive,
      })
    }
  }
  return alerts
}

// ─── Courses for student (modules active in student's class) ──────────────────

export function getCoursesForStudent(studentId: string): Module[] {
  const student = STUDENTS.find(s => s.id === studentId)
  if (!student) return []
  return MODULES
}

// ─── Students for module ──────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getStudentsForModule(_moduleId: string): Student[] {
  return STUDENTS
}

// ─── Recent attendance history ────────────────────────────────────────────────

export function getRecentAttendanceHistory(studentId: string, limit = 10): { date: string; moduleName: string; bookName: string; chapterName: string; status: 'present' | 'absent' }[] {
  const student = STUDENTS.find(s => s.id === studentId)
  if (!student) return []
  const sessions = getSessionsByClass(student.classId).sort((a, b) => b.date.localeCompare(a.date))
  const results: { date: string; moduleName: string; bookName: string; chapterName: string; status: 'present' | 'absent' }[] = []
  for (const session of sessions) {
    const record = getAllAttendance().find(a => a.sessionId === session.id && a.studentId === studentId)
    if (record) {
      const mod = MODULES.find(m => m.id === session.moduleId)
      const book = mod?.books.find(b => b.id === session.bookId)
      const chapterName = book?.chapters[session.chapterIndex] ?? `Chapter ${session.chapterIndex + 1}`
      results.push({
        date: session.date,
        moduleName: mod?.name ?? 'Unknown Module',
        bookName: book?.name ?? 'Unknown Book',
        chapterName,
        status: record.status,
      })
    }
    if (results.length >= limit) break
  }
  return results
}

// ─── Weekly trend ─────────────────────────────────────────────────────────────

export function getWeeklyTrend(studentId: string, classId?: string): WeeklyTrend[] {
  const student = STUDENTS.find(s => s.id === studentId)
  if (!student) return []
  const targetClassId = classId ?? student.classId
  const sessions = getSessionsByClass(targetClassId).sort((a, b) => a.date.localeCompare(b.date))
  const weekMap: Record<string, { present: number; total: number }> = {}
  for (const session of sessions) {
    const week = session.date.substring(0, 7)
    if (!weekMap[week]) weekMap[week] = { present: 0, total: 0 }
    const record = getAllAttendance().find(a => a.sessionId === session.id && a.studentId === studentId)
    if (record) {
      weekMap[week].total++
      if (record.status === 'present') weekMap[week].present++
    }
  }
  return Object.entries(weekMap).map(([week, { present, total }]) => ({
    week,
    rate: total > 0 ? Math.round((present / total) * 100) : 0,
  }))
}

export function getCourseWeeklyTrend(classId?: string): WeeklyTrend[] {
  const sessions = classId ? getSessionsByClass(classId) : getAllSessions()
  const sorted = sessions.sort((a, b) => a.date.localeCompare(b.date))
  const weekMap: Record<string, { present: number; total: number }> = {}
  for (const session of sorted) {
    const week = session.date.substring(0, 7)
    if (!weekMap[week]) weekMap[week] = { present: 0, total: 0 }
    const att = getAttendanceForSession(session.id)
    weekMap[week].present += att.filter(a => a.status === 'present').length
    weekMap[week].total += att.length
  }
  return Object.entries(weekMap).map(([week, { present, total }]) => ({
    week,
    rate: total > 0 ? Math.round((present / total) * 100) : 0,
  }))
}

// ─── Submit session ───────────────────────────────────────────────────────────

export function getSessionsByTeacher(teacherId: string): Session[] {
  return getAllSessions().filter(s => s.teacherId === teacherId)
}

export function getTeacherAttendanceRate(teacherId: string): number {
  const sessions = getSessionsByTeacher(teacherId)
  if (sessions.length === 0) return 0
  let present = 0, total = 0
  for (const session of sessions) {
    const att = getAttendanceForSession(session.id)
    present += att.filter(a => a.status === 'present').length
    total += att.length
  }
  return total > 0 ? Math.round((present / total) * 100) : 0
}

export function getClassesForTeacher(teacherId: string): Class[] {
  return CLASSES.filter(c => c.teacherId === teacherId)
}

export function getSessionsThisMonthByTeacher(teacherId: string): number {
  const now = new Date()
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return getSessionsByTeacher(teacherId).filter(s => s.date.startsWith(monthStr)).length
}

export function getTotalSessionsCount(): number {
  return getAllSessions().length
}

export function getStudentParticipationAvg(studentId: string): { avg: number; score: number; label: string } | null {
  const student = STUDENTS.find(s => s.id === studentId)
  if (!student) return null
  const records = getAllAttendance().filter(
    a => a.studentId === studentId && a.status === 'present' && a.participationLevel != null
  )
  if (records.length === 0) return null
  const LEVEL_SCORE: Record<number, number> = { 1: 0, 2: 25, 3: 50, 4: 75 }
  const totalScore = records.reduce((sum, r) => sum + LEVEL_SCORE[r.participationLevel!], 0)
  const avg = Math.round(totalScore / records.length)
  const LEVEL_LABEL: Record<number, string> = { 1: 'Needs improvement', 2: 'Occasional', 3: 'Class contribution', 4: 'Excellent' }
  const avgLevel = avg >= 63 ? 4 : avg >= 38 ? 3 : avg >= 13 ? 2 : 1
  return { avg, score: totalScore, label: LEVEL_LABEL[avgLevel] }
}

export function submitSession(params: {
  classId: string
  moduleId: string
  teacherId: string
  date: string
  bookId: string
  chapterIndex: number
  records: { studentId: string; status: 'present' | 'absent'; participationLevel?: 1 | 2 | 3 | 4 }[]
}): { success: boolean; error?: string } {
  const existing = getAllSessions().find(
    s => s.classId === params.classId && s.date === params.date &&
         s.moduleId === params.moduleId && s.bookId === params.bookId && s.chapterIndex === params.chapterIndex
  )
  if (existing) return { success: false, error: 'Attendance for this chapter in this class has already been recorded today.' }
  const sessionId = `rt-${Date.now()}`
  runtimeSessions.push({ id: sessionId, classId: params.classId, moduleId: params.moduleId, teacherId: params.teacherId, date: params.date, bookId: params.bookId, chapterIndex: params.chapterIndex })
  params.records.forEach((r, i) => {
    runtimeAttendance.push({
      id: `rta-${sessionId}-${i}`,
      sessionId,
      studentId: r.studentId,
      status: r.status,
      ...(r.status === 'present' && r.participationLevel ? { participationLevel: r.participationLevel } : {}),
    })
  })
  return { success: true }
}

export function addClass(name: string, teacherId: string): Class {
  const cls: Class = { id: `cls-${Date.now()}`, name, teacherId }
  runtimeClasses.push(cls)
  return cls
}

export function updateClass(id: string, patch: { name?: string; teacherId?: string }): void {
  const inRuntime = runtimeClasses.find(c => c.id === id)
  if (inRuntime) {
    if (patch.name !== undefined) inRuntime.name = patch.name
    if (patch.teacherId !== undefined) inRuntime.teacherId = patch.teacherId
    return
  }
  const inBase = CLASSES.find(c => c.id === id)
  if (inBase) {
    if (patch.name !== undefined) inBase.name = patch.name
    if (patch.teacherId !== undefined) inBase.teacherId = patch.teacherId
  }
}

export function deleteClass(id: string): void {
  const runtimeIdx = runtimeClasses.findIndex(c => c.id === id)
  if (runtimeIdx !== -1) {
    runtimeClasses.splice(runtimeIdx, 1)
  } else {
    runtimeDeletedClassIds.add(id)
  }
  // Unassign all students whose effective classId matches this class
  for (const s of STUDENTS) {
    if ((runtimeStudentPatches[s.id]?.classId ?? s.classId) === id) {
      runtimeStudentPatches[s.id] = { ...runtimeStudentPatches[s.id], classId: '' }
    }
  }
}

export function addTeacher(name: string): Teacher {
  const t: Teacher = { id: `tch-${Date.now()}`, name }
  runtimeTeachers.push(t)
  return t
}

export function updateTeacher(id: string, patch: { name?: string }): void {
  const inRuntime = runtimeTeachers.find(t => t.id === id)
  if (inRuntime) {
    if (patch.name !== undefined) inRuntime.name = patch.name
    return
  }
  const inBase = TEACHERS.find(t => t.id === id)
  if (inBase && patch.name !== undefined) inBase.name = patch.name
}

export function deleteTeacher(id: string): void {
  const rtIdx = runtimeTeachers.findIndex(t => t.id === id)
  if (rtIdx !== -1) { runtimeTeachers.splice(rtIdx, 1); return }
  runtimeDeletedTeacherIds.add(id)
}

export function addChurch(name: string, denominationId: string): Church {
  const c: Church = { id: `ch-${Date.now()}`, name, denominationId }
  runtimeChurches.push(c)
  return c
}

export function updateChurch(id: string, patch: { name?: string; denominationId?: string }): void {
  const inRuntime = runtimeChurches.find(c => c.id === id)
  if (inRuntime) {
    if (patch.name !== undefined) inRuntime.name = patch.name
    if (patch.denominationId !== undefined) inRuntime.denominationId = patch.denominationId
    return
  }
  const inBase = CHURCHES.find(c => c.id === id)
  if (inBase) {
    if (patch.name !== undefined) inBase.name = patch.name
    if (patch.denominationId !== undefined) inBase.denominationId = patch.denominationId
  }
}

export function deleteChurch(id: string): void {
  const rtIdx = runtimeChurches.findIndex(c => c.id === id)
  if (rtIdx !== -1) { runtimeChurches.splice(rtIdx, 1); return }
  runtimeDeletedChurchIds.add(id)
}
