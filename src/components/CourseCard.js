import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css';

const CourseCard = ({ course }) => {
  const stars = Math.round(course.rating || 4);
  return (
    <Link to={`/courses/${course._id}`} className="ccard">
      <div className="ccard__img-wrap">
        <img
          src={course.image || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600'}
          alt={course.title}
          className="ccard__img"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600'; }}
        />
        <div className="ccard__overlay" />
        <span className="ccard__category t-label">{course.category}</span>
      </div>
      <div className="ccard__body">
        <h3 className="ccard__title">{course.title}</h3>
        <p className="ccard__instructor">by {course.instructor}</p>
        <p className="ccard__desc">{course.description.slice(0, 80)}…</p>
        <div className="ccard__meta">
          <span className="tag">{course.level}</span>
          <span className="ccard__duration">⏱ {course.duration}</span>
        </div>
        <div className="ccard__footer">
          <div className="ccard__rating">
            <span className="stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
            <span className="ccard__rating-num">{course.rating}</span>
            <span className="ccard__enrolled">({(course.enrolledCount || 0).toLocaleString()})</span>
          </div>
          <div className="ccard__price">
            {course.price === 0
              ? <span className="ccard__free">free</span>
              : <span>₹{course.price.toLocaleString()}</span>
            }
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
