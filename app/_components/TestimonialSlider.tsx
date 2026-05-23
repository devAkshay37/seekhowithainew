'use client';

import { useState } from 'react';

const testimonials = [
  {
    q: '"I used to spend my whole Sunday planning the week. Now I do it in 20 minutes. SeekhoWithAI gives me my weekends back."',
    name: 'Priya Desai',
    city: 'Class Teacher · Pune, CBSE School',
    avatar: '👩‍🏫',
  },
  {
    q: '"The Marathi output is surprisingly natural - not robotic at all. My students actually enjoy the worksheets it generates."',
    name: 'Suresh Jadhav',
    city: 'Subject Teacher · Nashik, State Board',
    avatar: '👨‍🏫',
  },
  {
    q: '"As a HOD, I can now review and approve all Techpacks in one place. Consistency across our department has improved dramatically."',
    name: 'Rekha Mehta',
    city: 'Head of Department · Surat, CBSE School',
    avatar: '👩‍💼',
  },
];

export default function TestimonialSlider() {
  const [tIdx, setTIdx] = useState(0);

  const goT = (i: number) => setTIdx(i);
  const nextT = () => setTIdx((prev) => (prev + 1) % testimonials.length);
  const prevT = () => setTIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[tIdx];

  return (
    <section className="testi-section">
      <div className="testi-inner reveal">
        <div className="testi-stars-lg">★ ★ ★ ★ ★</div>
        <div className="testi-quote-lg">{t.q}</div>
        <div className="testi-author">
          <div className="testi-avatar">{t.avatar}</div>
          <div>
            <div className="testi-name">{t.name}</div>
            <div className="testi-meta">{t.city}</div>
          </div>
        </div>
        <div className="testi-nav">
          <button className="testi-btn" onClick={prevT}>←</button>
          <div className="testi-dots">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={`t-dot${i === tIdx ? ' active' : ''}`}
                onClick={() => goT(i)}
              />
            ))}
          </div>
          <button className="testi-btn" onClick={nextT}>→</button>
        </div>
      </div>
    </section>
  );
}
