create table groups(id serial primary key, name text not null, num int not null);
create table group_user(groupid int not null, userid text not null, groupname text not null);
create table events(id serial primary key, name text, description text, start date, groupid int);
create table availabilities(id serial primary key, eventid int, userid text, delta int);