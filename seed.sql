insert into manager(first_name,last_name,department_id)
values ("Lyndon","Johnson",1),("Ashley","Bloskas", 2),("Justin","Bieber", 3),("Jason","Bourne",4);

INSERT INTO department (departmentName)
VALUES ("HR"), ("Sales"), ("Coding"), ("MIS");

INSERT INTO role (title, salary, department_id)
VALUE ("Recruiting", 40000, 1), ("Sales Associate", 50000, 2), ("Senior Developer", 60000, 3), ("Assistant", 70000, 1), ("Product Developer", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Sally", "Yates", 1, NULL), ("Barack", "Obama", 2, NULL), ("Donald", "Trump", 3, NULL), ("Rachel", "Lee", 4, 2), ("IDK", "ANYMORE", 4, 1), ("HELP", "ME", 5, 3);