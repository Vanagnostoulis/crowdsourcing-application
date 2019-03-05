drop Database if exists project;
create Database project;
use project;

-- email domains: gmail.com, yahoo.com, etc
create table  Email_Domains (
	Domain_Id 		int unsigned auto_increment ,
    Domain_Name  	varchar(100) not null unique,
	primary key (Domain_Id)
);

create table Blacklist (
 Token varchar(300) character set utf8 collate utf8_general_ci
 );

create table  Users (
	Username	varchar(64) character set utf8 collate utf8_general_ci,
	Password	varchar(64) ,
	Points 		int unsigned default 0,	
    Admin		int(1) default 0,
    -- email
    Domain_Id 		int unsigned not null, 
    Local_Part		varchar(64) not null,						-- i.e. marios.cako
    foreign key (Domain_Id)	references Email_Domains(Domain_Id) -- i.e. gmail.com
	on delete cascade	-- this means that if gmail closes then delete every users used to have gmail.
	on update cascade,
	
    primary key (Domain_Id, Local_Part) -- email as primary key
);

create table  Users_Locations (
	-- email as foreign key for user
	Domain_Id int unsigned not null, 
	Local_Part varchar(64) not null,
	foreign key (Domain_Id, Local_Part) references Users(Domain_Id, Local_Part)
	on delete cascade 
	on update cascade,
	
	-- address
	Street		varchar(64) character set utf8 collate utf8_general_ci not null,
	Num 		int unsigned ,
	Postal_Code     varchar(16),
	Region 		varchar(30) character set utf8 collate utf8_general_ci not null, -- e.i Nea Ionia
	
	Time_Inserted datetime,
	Loc_Id 		int unsigned not null auto_increment, 
	primary key (Loc_Id)
	 
);	

create table  Store (
	Type 	enum ('Liquor Store', 'Super Market', 'Kiosk') not null,
	Name 	varchar(100) character set utf8 collate utf8_general_ci,
	
	-- location
	Longtitude 	real(17,15),
	Latitude 	real(17,15),
	Phone_Num 	varchar(64) character set utf8 collate utf8_general_ci ,
    
    -- email
    Local_Part  varchar(64) ,		-- i.e. marios.cako
    Domain_Id 	int unsigned , 		-- i.e. gmail.com							
    foreign key (Domain_Id)	references Email_Domains(Domain_Id) 
	on delete cascade
	on update cascade,
	
	Withdrawn	int(1) default 0, 		-- an to store exei papsei na katagrafetai sto parathriirio
	Store_Id	int unsigned auto_increment not null,	
	primary key (Store_Id)
);

create table  Store_Address (
	Store_Id	int unsigned not null,
	Street 		varchar(64) character set utf8 collate utf8_general_ci not null,
	Num 		int unsigned ,
	Postal_Code 	varchar(16),
	Region 		varchar(64) character set utf8 collate utf8_general_ci not null, -- i.e. Nea Ionia
	
	primary key (Store_Id),
	foreign key (Store_Id) references Store (Store_Id)
	on delete cascade
	on update cascade
);

-- callendar of open hours for each store
create table Time_Table (
	Store_Id	int unsigned not null,
	Day 		varchar(100) character set utf8 collate utf8_general_ci,
	Open 		time,
	Close 		time,
	foreign key (Store_Id) references Store(Store_Id)
	on delete cascade
    on update cascade,
	
	primary key (Store_Id, Day)
);

create table Drinks (
	Drink_Id 	int unsigned auto_increment not null,
	Category 	varchar(20) character set utf8 collate utf8_general_ci not null,
	Description varchar(300) character set utf8 collate utf8_general_ci ,
	Name varchar(300) character set utf8 collate utf8_general_ci not null,
	Price 		real(6,2) not null,
	Ml 			int(4),
	Tag		varchar(30) character set utf8 collate utf8_general_ci,
	Store_Id 	int unsigned not null,
	Withdrawn 	int(1) default 0,
	-- Views_Per_Day 	int unsigned not null default 0,
	-- Start_Day 		date not null,
	-- Finish_Day 		date not null, 
	primary key(Drink_Id),
	foreign key(Store_Id) references Store(Store_Id) 
	on delete cascade
	on update cascade
);


create table Drinks_Log(
	Drink_Id	int unsigned not null,
	Updated_Date date not null,
	Price 		real(6,2) not null,
	foreign key(Drink_Id) references Drinks(Drink_Id)
	on delete cascade,
	Insert_Id		int unsigned auto_increment not null,
	primary key(Insert_Id)
);

create table Offers (
	Offer_Id		int unsigned auto_increment not null,
	Store_Id		int unsigned not null,
	Drink_Id		int unsigned not null, -- i need drinks id
	Target_Group	varchar(100) character set utf8 collate utf8_general_ci,
	Price 			real(4,2) not null,
	
	foreign key (Store_Id) references Store(Store_Id)
	on delete cascade
	on update cascade,
	
	foreign key (Drink_Id) references Drinks(Drink_Id)
	on delete cascade
	on update cascade,
	
	primary key (Offer_Id)	
);

create table Company (
	Store_Id	int unsigned not null,
	Username	varchar(64) character set utf8 collate utf8_general_ci,
	Pwrd		varchar(20) character set utf8 collate utf8_general_ci,
	
	Domain_Id	int unsigned not null,		-- i.e. gmail.com
	Local_Part  varchar(64) not null,		-- i.e. marios.cako 
    foreign key (Domain_Id)	references Email_Domains(Domain_Id) 
	on delete cascade
	on update cascade,
	
	foreign key (Store_Id) references Store(Store_Id)
	on delete cascade
	on update cascade,
	
	primary key  (Domain_Id, Local_Part)
);

insert into Email_Domains(Domain_Name) values ('admin.com');
insert into Users(Username, Password, Points, Admin, Local_Part, Domain_Id) values ('admin', 'admin', 0, 1, 'admin', (Select LAST_INSERT_ID()));




