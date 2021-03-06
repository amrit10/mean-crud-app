Add Employee
----
Creates and adds one new employee to the db 

* **URL**

  /addEmployee

* **Method:**
  
  `POST`
  
*  **URL Params**

    None

* **Data Params**

   **Required:**
   
     name = [string] <br />
     dob = [date] <br />
     salary = [numeric] <br />
     skills = [string[]] - Can be empty array <br />
     photo = [file] - jpg or png only. < 10 MB in size <br />

    **Optional:**
    
    None
   

* **Success Response:**

  * **Code:** 201 <br />
    **Content:** `{ message : Employee Added Successfully, employee : employee record }`
 
* **Error Response:**

  * **Code:** 500 DB CONNECTION FAILED <br />
    **Content:** `{ error : "DB CONNECTION FAILED" }`

  OR

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:** `{ error : "Validation Failed" }`
