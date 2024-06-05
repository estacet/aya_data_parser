CREATE TABLE departments (
 id integer NOT NULL PRIMARY KEY,
 department_name character varying NOT NULL
);

CREATE TABLE employees (
 id integer NOT NULL PRIMARY KEY,
 first_name character varying(255) NOT NULL,
 last_name character varying NOT NULL,
 department_id integer REFERENCES departments(id)
);

CREATE TABLE statements (
 id integer NOT NULL PRIMARY KEY,
 employee_id integer REFERENCES employees(id),
 created_at timestamp without time zone,
 amount decimal NOT NULL
);

CREATE TABLE donations (
 id integer NOT NULL PRIMARY KEY,
 employee_id integer REFERENCES employees(id),
 created_at timestamp without time zone,
 amount decimal NOT NULL,
 currency char(3) NOT NULL,
 amount_in_usd decimal NOT NULL
);

CREATE TABLE rates (
 created_at timestamp without time zone,
 sign char(3),
 value decimal NOT NULL
);
