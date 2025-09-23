from models import *
from faker import Faker
import random
from config import db, app

fake =Faker()
with app.app_context():
    Teacher.query.delete()
    Student.query.delete()
    Guardian.query.delete()
    ClassTeacher.query.delete()
    StudentSubject.query.delete()
    TeacherSubject.query.delete()
    Subject.query.delete()
    db.session.commit()
    class_teachers = []
    
    class_teacher1= ClassTeacher(name="Mrs. Anne Wanjiku", age=30, gender="Female", phone_number="0723456371")
    class_teacher1.password_hash = "54321"
    class_teacher2= ClassTeacher(name="Mrs. Esther Wangui", age=50, gender="Female", phone_number="0756234589")
    class_teacher2.password_hash = "54321"
    class_teacher3= ClassTeacher(name="Mr. John Kamau", age=40, gender="Male", phone_number="0722678987")
    class_teacher3.password_hash = "54321"
    db.session.add_all([class_teacher1, class_teacher2, class_teacher3])
    db.session.commit()
    relationships=["Parent", "Guardian"]
    
    guardians=[]
    for i in range(15):
        guardian= Guardian(name=fake.name(), phone_number=fake.phone_number(), relationship= random.choice(relationships))
        guardian.password_hash = "guardian"
        guardians.append(guardian)
    db.session.add_all(guardians)
    db.session.commit()
    
    
    teachers = []
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
        teacher.password_hash = 'teacherpassword'
        teachers.append(teacher)
    db.session.add_all(teachers)
    db.session.commit()

    
    general_reports= ["needs to improve overall", "Doing well. Well done"]
    random_photos=["https://thumbs.dreamstime.com/b/happy-black-teen-boy-outside-african-american-smiles-sitting-bench-192130399.jpg", "https://thumbs.dreamstime.com/b/african-american-confident-teen-male-stares-confidently-lens-camera-as-poses-high-school-senior-73055413.jpg", "https://media.istockphoto.com/id/887302366/photo/portrait-of-male-teenage-student-in-uniform-outside-buildings.jpg?s=612x612&w=0&k=20&c=hoha_IGYlGKM57gqX0QPQdnBvnrJPtHLn8ErZ6QK2nY=", "https://img.freepik.com/premium-photo/vertical-portrait-teen-african-american-male-high-school-student-looking-camera-back-school_411082-874.jpg"]
    students = []
    for i in range(30):
        student = Student(
            name = f"{fake.first_name_male()} {fake.last_name()}",
            classteacher_id=fake.random_int(min=1, max=3),
            guardian_id=fake.random_int(min=1, max=15),
            general_report=random.choice(general_reports),
            fee_status=fake.boolean(chance_of_getting_true=70),
            image= random.choice(random_photos)
        )
        student.password_hash = 'password'
        students.append(student)
    db.session.add_all(students)
    db.session.commit()
    
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

    for student in students:
        for subject in subjects:
            student_subject = StudentSubject(
                student_id=student.id,
                subject_id=subject.id,
                teacher_id=fake.random_int(min=1, max=10)
            )
            db.session.add(student_subject)
    db.session.commit()

    for teacher in teachers:
        for subject in subjects:
            teacher_subject = TeacherSubject(
                teacher_id=teacher.id,
                subject_id=subject.id
            )
            db.session.add(teacher_subject)
    db.session.commit()
