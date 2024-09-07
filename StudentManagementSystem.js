$(document).ready(function() {
    const homeForm = $('#homeclass');
    const addStudentForm = $('#add-class');
    const checklistStudentForm = $('#studentlist');
    const studentTableBody = $('#studentTable tbody');

    // Handle "Check List" button on home screen
    $('button[name="btnCheckList"]').on('click', function(event) {
        event.preventDefault();
        homeForm.fadeOut(300, function() {
            checklistStudentForm.fadeIn(300);
            fetchStudents(); // Load students when navigating to the checklist
        });
    });

    // Handle "Add Student" button on home screen
    $('button[name="addListStudent"]').on('click', function(event) {
        event.preventDefault();
        homeForm.fadeOut(300, function() {
            addStudentForm.fadeIn(300);
        });
    });

    // Handle "Check List" button in the Add Student form
    $('#checklist').on('click', function(event) {
        event.preventDefault();
        addStudentForm.fadeOut(300, function() {
            checklistStudentForm.fadeIn(300);
            fetchStudents(); // Load students when navigating to the checklist
        });
    });

    // Handle "Add Student" button in the Student List section
    $('#addbutton').on('click', function(event) {
        event.preventDefault();
        checklistStudentForm.fadeOut(300, function() {
            addStudentForm.fadeIn(300);
        });
    });

    // Handle "Back to Home" button
    $('.back-home-btn').on('click', function(event) {
        event.preventDefault();
        addStudentForm.add(checklistStudentForm).fadeOut(300, function() {
            homeForm.fadeIn(300);
        });
    });

    // Handle Add Student form submission
    $('#addStudentForm').on('submit', function(event) {
        event.preventDefault();

        // Get form data
        const fullname = $('#fullname').val();
        const email = $('#email').val();
        const age = $('#age').val();
        const studentClass = $('#class').val();

        // Validate form data
        const nameRegex = /^[A-Za-z\s]+$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!nameRegex.test(fullname)) {
            alert('Full Name must only contain letters.');
            return;
        }
        if (!emailRegex.test(email) || !email.endsWith('.com')) {
            alert('Please enter a valid email address ending with .com.');
            return;
        }
        const ageValue = parseInt(age, 10);
        if (isNaN(ageValue) || age.length > 2) {
            alert('Please enter a valid age (up to 2 digits).');
            return;
        }

        // Send data to the server via AJAX
        $.ajax({
            url: 'add_student.php', // PHP script to handle adding student
            type: 'POST',
            data: {
                action: 'add',
                fullname: fullname,
                email: email,
                age: age,
                class: studentClass
            },
            success: function(response) {
                alert('Student added successfully!');
                // Reset form and navigate to the student list
                $('#addStudentForm')[0].reset();
                addStudentForm.fadeOut(300, function() {
                    checklistStudentForm.fadeIn(300);
                    loadStudents(); // Reload the student list
                });
            },
            error: function(xhr, status, error) {
                alert('An error occurred: ' + error);
            }
        });
    });

    // Age input restriction to two digits and only numeric
    $('#age').on('input', function() {
        let value = $(this).val();
        value = value.replace(/[^0-9]/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2);
        }
        $(this).val(value);
    });

    // Validate full name to disallow numbers and symbols
    $('#fullname').on('input', function() {
        const value = $(this).val();
        const nameRegex = /^[A-Za-z\s]*$/;
        if (!nameRegex.test(value)) {
            $(this).val(value.replace(/[^A-Za-z\s]/g, ''));
            alert('Full Name must only contain letters.');
        }
    });

    // Email input restriction to allow only numbers, letters, periods, and @
    $('#email').on('input', function() {
        let value = $(this).val();
        value = value.replace(/[^a-zA-Z0-9.@]/g, '');
        $(this).val(value);
    });

    // Handle Update and Delete button clicks in the student table
    studentTableBody.on('click', '.update-btn', function() {
        const row = $(this).closest('tr');
        const id = row.data('id');
        const fullname = row.find('td').eq(1).text();
        const email = row.find('td').eq(2).text();
        const age = row.find('td').eq(3).text();
        const studentClass = row.find('td').eq(4).text();

        // Populate the Add Student form with the current row's data
        $('#fullname').val(fullname);
        $('#email').val(email);
        $('#age').val(age);
        $('#class').val(studentClass);

        // Change the submit button to "Update"
        $('#addStudentForm').off('submit').on('submit', function(event) {
            event.preventDefault();

            // Get updated data
            const updatedFullname = $('#fullname').val();
            const updatedEmail = $('#email').val();
            const updatedAge = $('#age').val();
            const updatedClass = $('#class').val();

            // Send updated data to the server via AJAX
            $.ajax({
                url: 'update_student.php', // PHP script to handle updating student
                type: 'POST',
                data: {
                    action: 'update',
                    id: id,
                    fullname: updatedFullname,
                    email: updatedEmail,
                    age: updatedAge,
                    class: updatedClass
                },
                success: function(response) {
                    alert('Student updated successfully!');
                    row.find('td').eq(1).text(updatedFullname);
                    row.find('td').eq(2).text(updatedEmail);
                    row.find('td').eq(3).text(updatedAge);
                    row.find('td').eq(4).text(updatedClass);

                    $('#addStudentForm')[0].reset();
                    addStudentForm.fadeOut(300, function() {
                        checklistStudentForm.fadeIn(300);
                    });

                    // Rebind the submit event handler
                    $('#addStudentForm').off('submit').on('submit', function(event) {
                        event.preventDefault();
                        // Add student logic here...
                        const fullname = $('#fullname').val();
                        const email = $('#email').val();
                        const age = $('#age').val();
                        const studentClass = $('#class').val();
                        $.ajax({
                            url: 'add_student.php',
                            type: 'POST',
                            data: {
                                action: 'add',
                                fullname: fullname,
                                email: email,
                                age: age,
                                class: studentClass
                            },
                            success: function(response) {
                                alert('Student added successfully!');
                                $('#addStudentForm')[0].reset();
                                addStudentForm.fadeOut(300, function() {
                                    checklistStudentForm.fadeIn(300);
                                    loadStudents();
                                });
                            },
                            error: function(xhr, status, error) {
                                alert('An error occurred: ' + error);
                            }
                        });
                    });
                },
                error: function(xhr, status, error) {
                    alert('An error occurred: ' + error);
                }
            });
        });

        addStudentForm.fadeIn(300);
    });

    studentTableBody.on('click', '.delete-btn', function() {
        if (confirm('Are you sure you want to delete this student?')) {
            const row = $(this).closest('tr');
            const id = row.data('id');

            // Send delete request to the server
            $.ajax({
                url: 'delete_student.php', // PHP script to handle deleting student
                type: 'POST',
                data: { id: id },
                success: function(response) {
                    alert('Student deleted successfully!');
                    row.remove();
                },
                error: function(xhr, status, error) {
                    alert('An error occurred: ' + error);
                }
            });
        }
    });

    // Load students from the server and display in the table
    function loadStudents() {
        $.ajax({
            url: 'fetch_students.php', // PHP script to fetch students
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                studentTableBody.empty(); // Clear existing rows
                $.each(data, function(index, student) {
                    studentTableBody.append(`
                        <tr data-id="${student.id}">
                            <td>${student.id}</td>
                            <td>${student.fullname}</td>
                            <td>${student.email}</td>
                            <td>${student.age}</td>
                            <td>${student.class}</td>
                            <td>
                                <button class="action-btn update-btn">Update</button>
                                <button class="action-btn delete-btn">Delete</button>
                            </td>
                        </tr>
                    `);
                });
            },
            error: function(xhr, status, error) {
