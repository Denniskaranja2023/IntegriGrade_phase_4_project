from config import db
from sqlalchemy_serializer import SerializerMixin

class ClassTeacher(db.Model, SerializerMixin):
    __tabelname__= 'classteachers'
    
    id= db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String, unique=True)
    gender= db.Column(db.String)
    age= db.Column(db.Integer)
    
class Student(db.Model, SerializerMixin):
    __tablename__= 'students'

    id= db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String, unique=True)
    classteacher_id= db.Column(db.String)
    guardian_id= db.Column(db.String)
    general_report= db.Column(db.String)
    fee_status= db.Column(db.Boolean)
    image= db.Column(db.String)
    
class Guardian(db.Model, SerializerMixin):
    id= db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String, unique=True)
    relationship= db.Column(db.String)
    
class Subject(db.Model, SerializerMixin):
    id= db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String, unique=True)
    description= db.Column(db.String)
    
class Teacher(db.Model, SerializerMixin):
    id= db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String, unique=True)
    gender= db.Column(db.String)
    age= db.Column(db.Integer)
    
class StudentSubject(db.Model, SerializeMixin):
    student_id= db.Column(db.Integer)
    subject_id=db.Column(db.Integer)
    teachers_id=db.Column(db.Integer)
    grade=db.Column(db.Integer)
    
class TeacherSubject(db.Model, SerializerMixin):
    teacher_id= db.Column(db.Integer)
    subject_id= db.Column(db.Integer)
    
    