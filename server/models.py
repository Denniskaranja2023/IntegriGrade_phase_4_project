from config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from config import bcrypt

class ClassTeacher(db.Model, SerializerMixin):
    __tablename__ = 'classteachers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    gender = db.Column(db.String)
    age = db.Column(db.Integer)
    _password_hash = db.Column(db.String)
    
    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8')) 
        self._password_hash = password_hash.decode('utf-8')
    
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    students = db.relationship('Student', back_populates='classteacher', lazy=True)
    
class Guardian(db.Model, SerializerMixin):
    __tablename__ = 'guardians'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    relationship = db.Column(db.String)
    _password_hash = db.Column(db.String)
    
    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8')) 
        self._password_hash = password_hash.decode('utf-8')
    
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    students = db.relationship('Student', back_populates='guardian', lazy=True)
    
class Student(db.Model, SerializerMixin):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    classteacher_id = db.Column(db.Integer, db.ForeignKey('classteachers.id'))
    guardian_id = db.Column(db.Integer, db.ForeignKey('guardians.id'))
    general_report = db.Column(db.String)
    fee_status = db.Column(db.Boolean)
    image = db.Column(db.String)
    _password_hash = db.Column(db.String)
    
    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8')) 
        self._password_hash = password_hash.decode('utf-8')
    
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    classteacher = db.relationship('ClassTeacher', back_populates='students')
    guardian = db.relationship('Guardian', back_populates='students')
    student_subjects = db.relationship('StudentSubject', back_populates='student', lazy=True)
    
class Subject(db.Model, SerializerMixin):
    __tablename__ = 'subjects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    description = db.Column(db.String)
    
    student_subjects = db.relationship('StudentSubject', back_populates='subject', lazy=True)
    teacher_subjects = db.relationship('TeacherSubject', back_populates='subject', lazy=True)
    
class Teacher(db.Model, SerializerMixin):
    __tablename__ = 'teachers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    gender = db.Column(db.String)
    age = db.Column(db.Integer)
    _password_hash = db.Column(db.String)
    
    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8')) 
        self._password_hash = password_hash.decode('utf-8')
    
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    student_subjects = db.relationship('StudentSubject', back_populates='teacher', lazy=True)
    teacher_subjects = db.relationship('TeacherSubject', back_populates='teacher', lazy=True)
    
class StudentSubject(db.Model, SerializerMixin):
    __tablename__ = 'student_subjects'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'))
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'))
    grade = db.Column(db.Integer)
    
    student = db.relationship('Student', back_populates='student_subjects')
    subject = db.relationship('Subject', back_populates='student_subjects')
    teacher = db.relationship('Teacher', back_populates='student_subjects')
    
class TeacherSubject(db.Model, SerializerMixin):
    __tablename__ = 'teacher_subjects'
    
    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'))
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'))
    
    teacher = db.relationship('Teacher', back_populates='teacher_subjects')
    subject = db.relationship('Subject', back_populates='teacher_subjects')
    
    