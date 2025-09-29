from config import app, api, Resource, make_response, request, db
from models import *
from flask import session
from flask import render_template

@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")


#1. CLASS_TEACHER RESOURCES
class SubjectResource(Resource):
    # used by a classteacher to create a new subject
    def post(self):
        data = request.get_json()
        
        if Subject.query.filter_by(name=data['name']).first():
            return make_response({'error': 'Subject already exists'}, 400)
        
        subject = Subject(
            name=data['name'],
            description=data.get('description')
        )
        
        db.session.add(subject)
        db.session.commit()
        
        return make_response({'id': subject.id, 'name': subject.name}, 201)
    
    # used to get all subjects
    def get(self):
        subjects = Subject.query.all()
        subjects_data = [{'id': subject.id, 'name': subject.name} for subject in subjects]
        return make_response(subjects_data, 200)
api.add_resource(SubjectResource, '/api/subjects')

class TeacherResource(Resource):
    # used by a class teacher to create a new teacher
    def post(self):
        data = request.get_json()
        
        if Teacher.query.filter_by(name=data['name']).first():
            return make_response({'error': 'Teacher already exists'}, 400)
        
        teacher = Teacher(
            name=data['name'],
            gender=data.get('gender'),
            age=data.get('age'),
            phone_number=data.get('phone_number')
        )
        teacher.password_hash = data['password']
        
        db.session.add(teacher)
        db.session.commit()
        
        return make_response({'id': teacher.id, 'name': teacher.name}, 201)
    
    # used to get all teachers
    def get(self):
        teachers = Teacher.query.all()
        teachers_data = [{'id': teacher.id, 'name': teacher.name} for teacher in teachers]
        return make_response(teachers_data, 200)
api.add_resource(TeacherResource, '/api/teachers')

class ClassTeacherResource(Resource):
    # used to get all classteachers
    def get(self):
        classteachers = ClassTeacher.query.all()
        classteachers_data = [{'id': ct.id, 'name': ct.name} for ct in classteachers]
        return make_response(classteachers_data, 200)
api.add_resource(ClassTeacherResource, '/api/classteachers')

class GuardianResource(Resource):
    # used to get all guardians
    def get(self):
        guardians = Guardian.query.all()
        guardians_data = [{'id': g.id, 'name': g.name} for g in guardians]
        return make_response(guardians_data, 200)
api.add_resource(GuardianResource, '/api/guardians')

class TeacherSubjectResource(Resource):
    # used by a classteacher to assign a teacher to a subject
    def post(self):
        data = request.get_json()
        
        teacher = Teacher.query.get(data['teacher_id'])
        subject = Subject.query.get(data['subject_id'])
        
        if not teacher:
            return make_response({'error': 'Teacher not found'}, 404)
        if not subject:
            return make_response({'error': 'Subject not found'}, 404)
        
        if TeacherSubject.query.filter_by(teacher_id=data['teacher_id'], subject_id=data['subject_id']).first():
            return make_response({'error': 'Teacher already assigned to this subject'}, 400)
        
        teacher_subject = TeacherSubject(
            teacher_id=data['teacher_id'],
            subject_id=data['subject_id']
        )
        
        db.session.add(teacher_subject)
        db.session.commit()
        
        return make_response({'teacher': teacher.name, 'subject': subject.name}, 201)
api.add_resource(TeacherSubjectResource, '/api/teacher-subjects')

class ClassTeacherLoginResource(Resource):
    # used by a class teacher to login
    def post(self):
        data = request.get_json()
        
        class_teacher = ClassTeacher.query.filter_by(name=data['name']).first()
        if not class_teacher or not class_teacher.authenticate(data['password']):
            return make_response({'error': 'Invalid credentials'}, 401)
        
        session['classteacher_id'] = class_teacher.id
        
        return make_response({'id': class_teacher.id, 'name': class_teacher.name}, 200)
api.add_resource(ClassTeacherLoginResource, '/api/classteachers/login')

class ClassTeacherLogoutResource(Resource):
    # used by a class teacher to logout
    def post(self):
        session.pop('classteacher_id', None)
        return make_response({'message': 'Logged out successfully'}, 200)
api.add_resource(ClassTeacherLogoutResource, '/api/classteachers/logout')

class StudentsResource(Resource):
    # used by a classteacher to get her/his students
    def get(self, id):
        class_teacher = ClassTeacher.query.filter_by(id=id).first()
        if not class_teacher:
            return make_response({'error': 'ClassTeacher not found'}, 404)

        students = []
        for student in class_teacher.students:
            student_data = {
                'id': student.id,
                'name': student.name,
                'classteacher_id': student.classteacher_id,
                'guardian': {
                    'id': student.guardian.id,
                    'name': student.guardian.name,
                    'phone_number': student.guardian.phone_number
                } if student.guardian else None,
                'general_report': student.general_report,
                'fee_status': student.fee_status,
                'image': student.image,
                'student_subjects': [{
                    'id': ss.id,
                    'grade': ss.grade,
                    'subject': {'id': ss.subject.id, 'name': ss.subject.name} if ss.subject else None,
                    'teacher': {'id': ss.teacher.id, 'name': ss.teacher.name} if ss.teacher else None
                } for ss in student.student_subjects]
            }
            students.append(student_data)

        return make_response(students, 200)   
api.add_resource(StudentsResource, '/api/classteachers/<int:id>/students')

class StudentReportResource(Resource):
    # used by a class teacher to update or create a general report for a student and change the fee status
    def put(self, student_id):
        data = request.get_json()
        
        student = Student.query.get(student_id)
        if not student:
            return make_response({'error': 'Student not found'}, 404)
        if data.get('fee_status') is not None:
            student.fee_status = True if data['fee_status'] == 1 else False

        if data.get('general_report'):
            student.general_report = data['general_report']

            
        db.session.commit()
        
        return make_response({'student': student.name, 'general_report': student.general_report}, 200)
    
    # used by a class teacher to delete a student
    def delete(self, student_id):
        student = Student.query.get(student_id)
        if not student:
            return make_response({'error': 'Student not found'}, 404)
        
        db.session.delete(student)
        db.session.commit()
        
        return make_response({'message': 'Student deleted successfully'}, 200)
api.add_resource(StudentReportResource, '/api/students/<int:student_id>')

class StudentSubjectResourceClass(Resource):
    # used by a classteacher to assign a student to a subject with a teacher
    def post(self):
        data = request.get_json()
        
        student = db.session.get(Student, data['student_id'])
        teacher = db.session.get(Teacher, data['teacher_id'])
        subject = db.session.get(Subject, data['subject_id'])
        
        if not student:
            return make_response({'error': 'Student not found'}, 404)
        if not teacher:
            return make_response({'error': 'Teacher not found'}, 404)
        if not subject:
            return make_response({'error': 'Subject not found'}, 404)
        
        if StudentSubject.query.filter_by(student_id=data['student_id'], subject_id=data['subject_id']).first():
            return make_response({'error': 'Student already assigned to this subject'}, 400)
        
        student_subject = StudentSubject(
            student_id=data['student_id'],
            teacher_id=data['teacher_id'],
            subject_id=data['subject_id']
        )
        
        db.session.add(student_subject)
        db.session.commit()
        
        return make_response({'student': student.name, 'subject': subject.name, 'teacher': teacher.name}, 201)
api.add_resource(StudentSubjectResourceClass, '/api/student_subjects')

#2. STUDENT RESOURCES
class StudentSubjectsResource(Resource):
    # used by a student to get her/his subjects
    def get(self, id):
        student = Student.query.filter_by(id=id).first()
        if not student:
            return make_response({'error': 'Student not found'}, 404)

        subjects = []
        for ss in student.student_subjects:
            subject_data = {
                'id': ss.id,
                'grade': ss.grade,
                'subject': {'id': ss.subject.id, 'name': ss.subject.name} if ss.subject else None,
                'teacher': {'id': ss.teacher.id, 'name': ss.teacher.name} if ss.teacher else None
            }
            subjects.append(subject_data)

        return make_response(subjects, 200)
api.add_resource(StudentSubjectsResource, '/api/students/<int:id>/subjects')

class StudentSignupResource(Resource):
    # used by a student to sign up
    def post(self):
        data = request.get_json()
        
        if Student.query.filter_by(name=data['name']).first():
            return make_response({'error': 'Student already exists'}, 400)
        
        student = Student(
            name=data['name'],
            classteacher_id=data.get('classteacher_id'),
            guardian_id=data.get('guardian_id'),
            fee_status=data.get('fee_status', False),
            image=data.get('image')
        )
        student.password_hash = data['password']
        
        db.session.add(student)
        db.session.commit()
        
        return make_response({'id': student.id, 'name': student.name}, 201)
api.add_resource(StudentSignupResource, '/api/students/signup')

class StudentLoginResource(Resource):
    #used by a student to login
    def post(self):
        data = request.get_json()
        
        student = Student.query.filter_by(name=data['name']).first()
        if not student or not student.authenticate(data['password']):
            return make_response({'error': 'Invalid credentials'}, 401)
        
        session['student_id'] = student.id
        return make_response({'id': student.id, 'name': student.name}, 200)
api.add_resource(StudentLoginResource, '/api/students/login')

class StudentLogoutResource(Resource):
    def post(self):
        session.pop('student_id', None)
        return make_response({'message': 'Logged out successfully'}, 200)
api.add_resource(StudentLogoutResource, '/api/students/logout')

class StudentProfileResource(Resource):
    def get(self, id):
        student = Student.query.get(id)
        if not student:
            return make_response({'error': 'Student not found'}, 404)
        
        student_data = {
            'id': student.id,
            'name': student.name,
            'classteacher_id': student.classteacher_id,
            'guardian': {
                'id': student.guardian.id,
                'name': student.guardian.name,
                'phone_number': student.guardian.phone_number
            } if student.guardian else None,
            'general_report': student.general_report,
            'fee_status': student.fee_status,
            'image': student.image
        }
        
        return make_response(student_data, 200)
        
api.add_resource(StudentProfileResource, '/api/students/<int:id>/profile')



class StudentProfileUpdateResource(Resource):
    def put(self, id):
        return self._update_profile(id)
    
    def patch(self, id):
        return self._update_profile(id)
    
    def _update_profile(self, id):
        data = request.get_json()
        
        student = Student.query.get(id)
        if not student:
            return make_response({'error': 'Student not found'}, 404)
        
        # Allow students to update their own profile fields
        if 'name' in data:
            student.name = data['name']
        if 'image' in data:
            student.image = data['image']
        if 'password' in data:
            student.password_hash = data['password']
        
        db.session.commit()
        
        return make_response({
            'message': 'Profile updated successfully',
            'id': student.id,
            'name': student.name,
            'image': student.image
        }, 200)
        
api.add_resource(StudentProfileUpdateResource, '/api/students/<int:id>/profile/update')

#3. GUARDIAN RESOURCES
class GuardianStudentsResource(Resource):
    # used by a guardian to get her/his students
    def get(self, id):
        guardian = Guardian.query.filter_by(id=id).first()
        if not guardian:
            return make_response({'error': 'Guardian not found'}, 404)

        students = []
        for student in guardian.students:
            student_data = {
                'id': student.id,
                'name': student.name,
                'classteacher_id': student.classteacher_id,
                'classteacher': {
                    'id': student.classteacher.id,
                    'name': student.classteacher.name,
                    'phone_number': student.classteacher.phone_number
                } if student.classteacher else None,
                'general_report': student.general_report,
                'fee_status': student.fee_status,
                'image': student.image,
                'student_subjects': [{
                    'id': ss.id,
                    'grade': ss.grade,
                    'subject': {'id': ss.subject.id, 'name': ss.subject.name} if ss.subject else None,
                    'teacher': {'id': ss.teacher.id, 'name': ss.teacher.name} if ss.teacher else None
                } for ss in student.student_subjects]
            }
            students.append(student_data)

        return make_response(students, 200)
api.add_resource(GuardianStudentsResource, '/api/guardians/<int:id>/students')

class GuardianLoginResource(Resource):
    def post(self):
        data = request.get_json()
        
        guardian = Guardian.query.filter_by(name=data['name']).first()
        if not guardian or not guardian.authenticate(data['password']):
            return make_response({'error': 'Invalid credentials'}, 401)
        
        session['guardian_id'] = guardian.id
        return make_response({'id': guardian.id, 'name': guardian.name}, 200)
api.add_resource(GuardianLoginResource, '/api/guardians/login')

class GuardianLogoutResource(Resource):
    def post(self):
        session.pop('guardian_id', None)
        return make_response({'message': 'Logged out successfully'}, 200)
api.add_resource(GuardianLogoutResource, '/api/guardians/logout')

class GuardianSignupResource(Resource):
    def post(self):
        data = request.get_json()
        
        if Guardian.query.filter_by(name=data['name']).first():
            return make_response({'error': 'Guardian already exists'}, 400)
        
        guardian = Guardian(
            name=data['name'],
            relationship=data.get('relationship'),
            phone_number=data.get('phone_number')
        )
        guardian.password_hash = data['password']
        
        db.session.add(guardian)
        db.session.commit()
        
        return make_response({'id': guardian.id, 'name': guardian.name}, 201)
api.add_resource(GuardianSignupResource, '/api/guardians/signup')

#4. TEACHER RESOURCES
class TeacherLoginResource(Resource):
    def post(self):
        data = request.get_json()
        
        teacher = Teacher.query.filter_by(name=data['name']).first()
        if not teacher or not teacher.authenticate(data['password']):
            return make_response({'error': 'Invalid credentials'}, 401)
        
        session['teacher_id'] = teacher.id
        return make_response({'id': teacher.id, 'name': teacher.name}, 200)
api.add_resource(TeacherLoginResource, '/api/teachers/login')

class TeacherLogoutResource(Resource):
    def post(self):
        session.pop('teacher_id', None)
        return make_response({'message': 'Logged out successfully'}, 200)
api.add_resource(TeacherLogoutResource, '/api/teachers/logout')

class TeacherSignupResource(Resource):
    def post(self):
        data = request.get_json()
        
        if Teacher.query.filter_by(name=data['name']).first():
            return make_response({'error': 'Teacher already exists'}, 400)
        
        teacher = Teacher(
            name=data['name'],
            gender=data.get('gender'),
            age=data.get('age'),
            phone_number=data.get('phone_number')
        )
        teacher.password_hash = data['password']
        
        db.session.add(teacher)
        db.session.commit()
        
        return make_response({'id': teacher.id, 'name': teacher.name}, 201)
api.add_resource(TeacherSignupResource, '/api/teachers/signup')

class TeacherStudentsResource(Resource):
    # used by a teacher to get all their students
    def get(self, id):
        teacher = Teacher.query.get(id)
        if not teacher:
            return make_response({'error': 'Teacher not found'}, 404)
        
        students = []
        student_subjects = StudentSubject.query.filter_by(teacher_id=id).all()
        
        for ss in student_subjects:
            if ss.student:
                student_data = {
                    'id': ss.student.id,
                    'name': ss.student.name,
                    'classteacher_id': ss.student.classteacher_id,
                    'general_report': ss.student.general_report,
                    'fee_status': ss.student.fee_status,
                    'image': ss.student.image,
                    'grade': ss.grade,
                    'subject': {'id': ss.subject.id, 'name': ss.subject.name} if ss.subject else None
                }
                students.append(student_data)
        
        return make_response(students, 200)
api.add_resource(TeacherStudentsResource, '/api/teachers/<int:id>/students')

class TeacherStudentDetailResource(Resource):
    # used by a teacher to view a particular student's details and grades
    def get(self, teacher_id, student_id):
        teacher = Teacher.query.get(teacher_id)
        if not teacher:
            return make_response({'error': 'Teacher not found'}, 404)
        
        student_subject = StudentSubject.query.filter_by(teacher_id=teacher_id, student_id=student_id).first()
        if not student_subject:
            return make_response({'error': 'Student not taught by this teacher'}, 404)
        
        student = student_subject.student
        student_data = {
            'id': student.id,
            'name': student.name,
            'classteacher_id': student.classteacher_id,
            'general_report': student.general_report,
            'fee_status': student.fee_status,
            'image': student.image,
            'grade': student_subject.grade,
            'subject': {'id': student_subject.subject.id, 'name': student_subject.subject.name}
        }
        
        return make_response(student_data, 200)
    
api.add_resource(TeacherStudentDetailResource, '/api/teachers/<int:teacher_id>/students/<int:student_id>')

class StudentGradeResource(Resource):
    # used by a teacher to update a student's grade
    def put(self, teacher_id, student_id):
        data = request.get_json()
        
        student_subject = StudentSubject.query.filter_by(teacher_id=teacher_id, student_id=student_id).first()
        if not student_subject:
            return make_response({'error': 'Student not taught by this teacher'}, 404)
        
        student_subject.grade = data['grade']
        db.session.commit()
        
        return make_response({'student': student_subject.student.name, 'grade': student_subject.grade}, 200)
api.add_resource(StudentGradeResource, '/api/teachers/<int:teacher_id>/students/<int:student_id>/grade')



if __name__ == '__main__':
    app.run(port=5555, debug=True)