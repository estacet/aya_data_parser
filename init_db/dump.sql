CREATE TABLE departments (
 id integer NOT NULL PRIMARY KEY,
 name character varying NOT NULL
);

CREATE TABLE employees (
 id integer NOT NULL PRIMARY KEY,
 name character varying(30) NOT NULL,
 surname character varying(30) NOT NULL,
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
 amount_in_usd decimal NOT NULL,
 currency char(3) NOT NULL
);

CREATE TABLE rates (
 id integer NOT NULL PRIMARY KEY,
 created_at timestamp without time zone,
 sign char(3),
 value decimal NOT NULL
);
