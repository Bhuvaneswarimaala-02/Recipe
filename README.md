# Hello 

# STEPS TO RUN THE PROJECT

1. Create a Virtual Environment

   pythom -m venv venv
   
   venv\Scripts\activate

2. Intsall the required libraries

   pip install -r requirements.txt

3. Databse Setup:

   MySQL table setup through CLI

   > mysql -u root -p
   
   > CREATE DATABASE recipe_db;
   
   > USE recipe_db;
   
   > CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cuisine VARCHAR(255),
    title VARCHAR(255),
    rating FLOAT,
    prep_time INT,
    cook_time INT,
    total_time INT,
    description TEXT,
    nutrients JSON,
    serves VARCHAR(255)
    );
   
   > DESCRIBE recipes;

   ![image](https://github.com/user-attachments/assets/f8464221-ab52-4aca-8cdf-a60826228d2c)


4. Create the backend folder and file structures.

   - replace the details of the MySQL database in the right positions
   - correct the relative file paths with absolute ones if required
   - data folder: place the original json file here and run the preprocess.py to generate the cleaned json file
   - app folder: database.py - to scrap the data from json file and store it in MySQL DB; main.py - manages the API endpoints

5. RUN BACKEND

   - cd backend
   - cd data
   - python preprocess.py
   - (This generates the cleaned json file)
     ![image](https://github.com/user-attachments/assets/3343e246-b653-40cc-922c-a8e359dd80ac)

   - cd ..
   - cd app
   - python database.py
   - (The data gets stored in the MySQL Database - check via MySQL Workbench)
     ![image](https://github.com/user-attachments/assets/7091d7a9-057b-4ca2-a47d-e7ccf4cf15fc)

   - uvicorn main:app --reload
   - (To test the api endoints in browser)
   - ENDPOINT 1: 127.0.0.1:8000/api/recipes (shows stored data)
   - ENDPOINT 2: 127.0.0.1:8000/api/recipes?page=1&limit=10 (shows data in paginated fashion with customizable limit)
   - ENDPOINT 3: 127.0.0.1:8000/api/recipes?calories=<=400&&title=pie&rating=>=4.5 (shows filtered items, filters - based on any field)
   - ENDPOINT 4: 127.0.0.1:8000/api/recipes?calories<=450&&pages=1&limit=15 (shows filtered items with pagination)
     ![image](https://github.com/user-attachments/assets/d9b8f7e2-50ba-4871-9702-4ab945179bce)

     ![image](https://github.com/user-attachments/assets/9673a002-0092-454d-a7ad-dc0e2b2cf313)

     ![image](https://github.com/user-attachments/assets/c4f3846b-d143-49a4-bb32-57eb8fed16a0)

     ![image](https://github.com/user-attachments/assets/c8d5952e-35ff-4ac5-8144-6ce36d3db7e9)

6. Create a frontend folder - React+Vite

   > npm create vite@latest recipe-frontend --template react
   > cd recipe-frontend
   > npm install
   > npm install axios

   Setup the middleware and vite config to intergrate frontend with backend

   run : npm run dev

   OUTPUT:

   ![image](https://github.com/user-attachments/assets/578e2672-f888-4d3f-88d4-822198d74eae)

   ![image](https://github.com/user-attachments/assets/90bebd18-ec5b-4908-afc6-a6201e3c449b)

   ![image](https://github.com/user-attachments/assets/78c33dc0-3395-4d47-9a81-f54412f8f688)

   ![image](https://github.com/user-attachments/assets/f849d712-c90e-44cb-8b37-83a41a8e56bd)

   ![image](https://github.com/user-attachments/assets/01b3e73b-2d7b-4527-bdc4-da1f0154ec02)

# THANKYOU
