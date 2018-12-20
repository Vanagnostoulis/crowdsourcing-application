drop Database if exists project;
create Database project;
use project;

create table  Email_Domains (
	Domain_Id int unsigned auto_increment ,
    Domain_Name  varchar(100) not null unique,
	primary key (Domain_Id)
);

create table  Users (
	Username varchar(64) character set utf8 collate utf8_general_ci,
	Pwrd varchar (20) character set utf8 collate utf8_general_ci,
	Points int unsigned default 0,	
    Domain_Id int unsigned not null, 
    Local_Part    varchar(64) not null,			-- i.e. marios.cako
    foreign key (Domain_Id)	references Email_Domains(Domain_Id) -- i.e. gmail.com
	on delete cascade
	on update cascade,
    primary key  (Domain_Id, Local_Part)
);

create table  Users_Locations (
	Domain_Id int unsigned not null, 
	Local_Part varchar(64) not null,
	foreign key (Domain_Id, Local_Part) references Users(Domain_Id, Local_Part)
	on delete cascade 
	on update cascade,
	
	Street varchar(64) character set utf8 collate utf8_general_ci not null,
	Num int unsigned ,
	Postal_Code int unsigned,
	Region varchar(30) character set utf8 collate utf8_general_ci not null, -- e.i Nea Ionia
	
	Loc_Id int unsigned not null auto_increment, 
	primary key (Loc_Id),
	time_inserted datetime 
);	

create table  Store (
	Type enum ('Liquor Store', 'Super Market','Kiosk') not null,
	Store_Id int unsigned auto_increment not null,
	Name varchar(100) character set utf8 collate utf8_general_ci ,
	Longtitude real(7,5),
	Latitude real(7,5),
	Withdrawn int(1) default 0, -- an to store exei papsei na katagrafetai sto parathriirio
	Phone_Num varchar(80) character set utf8 collate utf8_general_ci ,
    Domain_Id int unsigned , 
    Local_Part    varchar(64) ,			-- i.e. marios.cako
    foreign key (Domain_Id)	references Email_Domains(Domain_Id) -- i.e. gmail.com
	on delete cascade
	on update cascade,	
	primary key (Store_Id)
);

create table  Store_Address (
	Store_Id int unsigned not null,
	Street varchar(64) character set utf8 collate utf8_general_ci not null,
	Num int unsigned ,
	Postal_Code int unsigned,
	Region varchar(30) character set utf8 collate utf8_general_ci not null, -- e.i Nea Ionia
	
	primary key (Store_Id),
	foreign key (Store_Id) references Store (Store_Id)
	on delete cascade
	on update cascade
);

create table Time_Table (
	Store_Id int unsigned not null,
	Day varchar(100) character set utf8 collate utf8_general_ci,
	Open time,
	Close time,
	foreign key (Store_Id) references Store(Store_Id)
	on delete cascade
    on update cascade,
	primary key (Store_Id, Day)
);

create table Drinks (
	Drink_Id int unsigned auto_increment not null,
	Type varchar(20) character set utf8 collate utf8_general_ci not null,
	Marka varchar(300) character set utf8 collate utf8_general_ci not null,
	Alcool int(2) ,
	Price real(4,2) not null,
	Ml int(4),
	Store_Id int unsigned not null,
	Withdrawn int(1) default 0,
	Views_Per_Day int unsigned not null default 0,
	Start_Day date not null,
	Finish_Day date not null, 
	primary key(Drink_Id),
	foreign key(Store_Id) references Store(Store_Id) 
	on delete cascade
	on update cascade
);

create table Offers (
	Offer_Id int unsigned auto_increment not null,
	Store_Id int unsigned not null,
	Drink_Id int unsigned not null, -- i need drinks id
	Target_Group varchar(100) character set utf8 collate utf8_general_ci,
	Price real(4,2) not null,
	foreign key (Store_Id) references Store(Store_Id)
	on delete cascade
	on update cascade,
	foreign key (Drink_Id) references Drinks(Drink_Id)
	on delete cascade
	on update cascade,
	primary key (Offer_Id)	
);

create table Company (
	Store_Id int unsigned not null,
	Username varchar(64) character set utf8 collate utf8_general_ci,
	Pwrd varchar(20) character set utf8 collate utf8_general_ci,
	Domain_Id int unsigned not null,
	Local_Part  varchar(64) not null,			-- i.e. marios.cako 
    foreign key (Domain_Id)	references Email_Domains(Domain_Id) -- i.e. gmail.com
	on delete cascade
	on update cascade,
	foreign key (Store_Id) references Store(Store_Id)
	on delete cascade
	on update cascade,
	primary key  (Domain_Id, Local_Part)
);



