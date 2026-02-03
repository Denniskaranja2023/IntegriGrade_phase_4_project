# Set SQLite before importing config to ensure we use local database
import os
import sys

# Add project root to Python path so absolute imports work
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Use DATABASE_URL from command line if provided, otherwise use SQLite
if len(sys.argv) > 1:
    os.environ['DATABASE_URL'] = sys.argv[1]
    print(f"Using database from command line: {sys.argv[1][:50]}...")
else:
    os.environ['DATABASE_URL'] = 'sqlite:///dev.db'
    print("Using SQLite database for local development")

from server.models import *
from faker import Faker
import random
from server.config import db, app

fake =Faker()
with app.app_context():
    # Clear all existing data using ORM delete operations
    StudentSubject.query.delete()
    TeacherSubject.query.delete()
    Student.query.delete()
    Subject.query.delete()
    Guardian.query.delete()
    ClassTeacher.query.delete()
    Teacher.query.delete()
    db.session.commit()
    
    print("Database cleared successfully")
    class_teachers = []
    
    class_teacher1= ClassTeacher(name="Anne Wanjiku", age=30, gender="Female", phone_number="0723456371")
    class_teacher1.password_hash = "classteacher"
    class_teacher2= ClassTeacher(name="Esther Wangui", age=50, gender="Female", phone_number="0756234589")
    class_teacher2.password_hash = "classteacher"
    class_teacher3= ClassTeacher(name="John Kamau", age=40, gender="Male", phone_number="0722678987")
    class_teacher3.password_hash = "classteacher"
    db.session.add_all([class_teacher1, class_teacher2, class_teacher3])
    db.session.commit()
    print("Classteachers successfully added")
    relationships=["Parent", "Guardian"]
    
    guardians=[]
    guardian_ex=Guardian(name="Andrew Kibe" , phone_number="0723456371", relationship="Parent")
    guardian_ex.password_hash = "guardian"
    guardians.append(guardian_ex)
    for i in range(15):
        guardian= Guardian(name=fake.name(), phone_number=fake.phone_number(), relationship= random.choice(relationships))
        guardian.password_hash = "guardian"
        guardians.append(guardian)
    db.session.add_all(guardians)
    db.session.commit()
    print("Guardians successfully added")
    
    
    teachers = []
    teacher_ex=Teacher(name="Jane Wambui", age=30, gender="Female", phone_number="0723456371")
    teacher_ex.password_hash = "teacher"
    teachers.append(teacher_ex)
    for i in range(5):
        gender = fake.random_element(elements=('Male', 'Female'))
    
        if gender == 'Male':
            name = f"{fake.first_name_male()} {fake.last_name()}"
        else:
             name = f"{fake.first_name_female()} {fake.last_name()}"
    
        teacher = Teacher(
            name=name,
            gender=gender,
            age=fake.random_int(min=25, max=60),
            phone_number=fake.phone_number()
        )
        teacher.password_hash = 'teacher'
        teachers.append(teacher)
    db.session.add_all(teachers)
    db.session.commit()
    print("Teachers successfully added")

    
    general_reports= ["needs to improve overall", "Doing well. Well done"]
    random_photos=["https://thumbs.dreamstime.com/b/happy-black-teen-boy-outside-african-american-smiles-sitting-bench-192130399.jpg", "https://thumbs.dreamstime.com/b/african-american-confident-teen-male-stares-confidently-lens-camera-as-poses-high-school-senior-73055413.jpg", "https://media.istockphoto.com/id/887302366/photo/portrait-of-male-teenage-student-in-uniform-outside-buildings.jpg?s=612x612&w=0&k=20&c=hoha_IGYlGKM57gqX0QPQdnBvnrJPtHLn8ErZ6QK2nY=", "https://img.freepik.com/premium-photo/vertical-portrait-teen-african-american-male-high-school-student-looking-camera-back-school_411082-874.jpg"]
    # Get actual classteacher and guardian IDs
    classteacher_ids = [ct.id for ct in [class_teacher1, class_teacher2, class_teacher3]]
    guardian_ids = [g.id for g in guardians]
    
    students = []
    student_ex=Student(name="Charlie Kirk", classteacher_id=classteacher_ids[0], guardian_id=guardian_ids[0], general_report="Doing well. Well done", fee_status=True, image="https://thumbs.dreamstime.com/b/happy-black-teen-boy-outside-african-american-smiles-sitting-bench-192130399.jpg")
    student_ex.password_hash = "student"
    students.append(student_ex)
    for i in range(30):
        student = Student(
            name = f"{fake.first_name_male()} {fake.last_name()}",
            classteacher_id=fake.random_element(elements=classteacher_ids),
            guardian_id=fake.random_element(elements=guardian_ids),
            general_report=random.choice(general_reports),
            fee_status=fake.boolean(chance_of_getting_true=70),
            image= random.choice(random_photos)
        )
        student.password_hash = 'student'
        students.append(student)
    db.session.add_all(students)
    db.session.commit()
    print("students successfully added")
    
    available_subjects=["Geography", "Chemistry", "Biology", "Mathematics", "English", "Kiswahili", "Physics", "History", "Computer Studies", "Agriculture"]
    subjects = []
    for sub_name in available_subjects:
        subject = Subject(
            name= sub_name,
            description=fake.sentence()
        )
        subjects.append(subject)
    db.session.add_all(subjects)
    db.session.commit()
    print("Subjects successfully added")
    
    # Get actual subject IDs
    subject_ids = [s.id for s in subjects]

    for teacher in teachers:
        used_subjects = set()
        for i in range(3):
            available_subjects = list(set(subject_ids) - used_subjects)
            if not available_subjects:
                break 
            subject_id = fake.random_element(elements=available_subjects)
            used_subjects.add(subject_id)   
            teacher_subject = TeacherSubject(
                teacher_id=teacher.id,
                subject_id=subject_id
            )
            db.session.add(teacher_subject)
            
    db.session.commit()
    print("TeacherSubjects successfully added")
    
    # Build a dictionary: subject_id -> list of teachers who teach it
    subject_teachers = {}
    for ts in TeacherSubject.query.all():
        subject_teachers.setdefault(ts.subject_id, []).append(ts.teacher_id)

    for student in students:
        used_subjects = set()
        used_teachers = set()

        for i in range(5):
            # pick a subject not already used for this student
            available_subjects = list(set(subject_ids) - used_subjects)
            if not available_subjects:
                break
            subject_id = fake.random_element(elements=available_subjects)
            used_subjects.add(subject_id)

            # pick a teacher who actually teaches that subject
            valid_teachers = subject_teachers.get(subject_id, [])
            available_teachers = list(set(valid_teachers) - used_teachers)
            if not available_teachers:
                continue  # no teacher left for this subject
            teacher_id = fake.random_element(elements=available_teachers)
            used_teachers.add(teacher_id)

            # create student-subject entry
            student_subject = StudentSubject(
                student_id=student.id,
                subject_id=subject_id,
                teacher_id=teacher_id,
                grade=fake.random_int(min=30, max=95)
            )
            db.session.add(student_subject)

    db.session.commit()
    print("StudentSubjects successfully added")
            
    print("complete")
