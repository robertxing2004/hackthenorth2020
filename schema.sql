drop table groups;
drop table group_user;
drop table events;
drop table availabilities;

create table users(id text primary key, name text);
create table groups(id serial primary key, name text not null, num int not null);
create table group_user(groupid int not null, userid text not null, groupname text not null);
create table events(id serial primary key, name text not null, description text not null, start date not null, groupid int not null);
create table availabilities(id serial primary key, eventid int not null, userid text not null, delta int not null);