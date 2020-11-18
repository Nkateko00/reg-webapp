create table places
(
    id serial not null primary key,
    places text not null,
    reg text not null
);
create table registration
(
    id serial not null primary key,
    reg_number varchar not null,
    -- specifies number of characters i want to have in registration
    places_id int not null,
    foreign key (places_id) references places(id)

);

insert into places (places, reg) values ('Bellville', 'CY');
insert into places (places, reg) values ('Cape Town', 'CA');
insert into places (places, reg) values ('Paarl', 'CJ');


