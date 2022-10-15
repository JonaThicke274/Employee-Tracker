INSERT INTO departments (name)
VALUES
    ('Client Relations'),
    ('Web Development'),
    ('Management');

INSERT INTO roles (name, salary, department_id)
VALUES
    ('Intern', 35000, 1),
    ('Client Liason', 50000, 1),
    ('Development Intern', 42500, 2),
    ('Junior Developer', 70000, 2),
    ('Senior Developer', 85000, 2),
    ('Manager', 100000, 3);
    
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Michelle', 'Garcia', 6, NULL),
    ('Omar', 'Jawaad', 5, 1),
    ('Jonathan', 'Lipata Arevalo', 4, 2),
    ('Rashaan', 'Scott', 4, 2),
    ('Alvir', 'Delima', 3, 3),
    ('Abigail', 'Trinidad', 3, 4),
    ('Anthony', 'On', 2, 1),
    ('Cameron', 'Villar', 2, 1),
    ('Andrew', 'Manzilla', 1, 8);