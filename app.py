from flask import Flask, request, jsonify, send_from_directory, send_file
import mysql.connector
from flask_cors import CORS
from mysql.connector import connect, Error
import os

app = Flask(__name__)
CORS(app)

# Set the upload folder path
app.config['UPLOAD_FOLDER'] = 'C:/Users/ASUS/Documents/SAFC/safc-assesment/uploads'

# Create the uploads directory if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/upload_photo', methods=['POST'])
def upload_photo():
    # Check if a file was included in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Get employee ID and user's name from request
    employee_id = request.form.get('id')
    if not employee_id:
        return jsonify({'error': 'Employee ID is required'}), 400

    username = request.form.get('username', 'Unknown_User')
    user_folder = os.path.join(app.config['UPLOAD_FOLDER'], username)

    # Create the user's directory if it doesn't exist
    if not os.path.exists(user_folder):
        os.makedirs(user_folder)

    if file:
        filename = f"{employee_id}.jpg"  # Save file as employee_id.jpg
        filepath = os.path.join(user_folder, filename)
        file.save(filepath)
        
        # Update the database with the filename
        conn = connect_to_db()
        if conn:
            cursor = conn.cursor()
            try:
                sql = "UPDATE employee SET profile_photo = %s WHERE id = %s"
                cursor.execute(sql, (filename, employee_id))
                conn.commit()
                return jsonify({'message': 'File successfully uploaded and database updated'}), 200
            except mysql.connector.Error as e:
                conn.rollback()
                print('Error updating database:', e)
                return jsonify({'error': 'Failed to update database'}), 500
            finally:
                cursor.close()
                conn.close()
                print('MySQL connection closed')
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500
        
@app.route('/profile_photo/<int:employee_id>', methods=['GET'])
def get_profile_photo(employee_id):
    # Construct the file path
    user_folder = 'C:/Users/ASUS/Documents/SAFC/safc-assesment/uploads/Unknown_User'
    filename = f"{employee_id}.jpg"
    filepath = os.path.join(user_folder, filename)
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404

    # Send the file as response
    return send_file(filepath, mimetype='image/jpeg')

def connect_to_db():
    """ Connect to MySQL database """
    conn = None
    try:
        # Connect to the MySQL server
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Password0907##",
            database="employeetable"
        )
        if conn.is_connected():
            print('Connected to MySQL database')
        return conn

    except mysql.connector.Error as e:
        print('Error connecting to MySQL:', e)
        return None

@app.route('/get_record', methods=['GET'])
def get_record():
    # Connect to MySQL
    conn = connect_to_db()

    if conn:
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM employee")
            feedback_data = cursor.fetchall()
            return jsonify(feedback_data)
        except mysql.connector.Error as e:
            print('Error retrieving feedback data:', e)
            return jsonify({'error': 'Failed to retrieve data'})
        finally:
            cursor.close()
            conn.close()
            print('MySQL connection closed')

@app.route('/add_record', methods=['POST'])
def add_record():
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        print("Received data:", data)  # Print the received data for debugging

        # Connect to MySQL
        conn = connect_to_db()

        if conn:
            cursor = conn.cursor()
            try:
                # Check if data is a list or a single record
                if isinstance(data, list):
                    # Data is a list of records
                    sql = """
                    INSERT INTO employee 
                    (name, username, password, status) 
                    VALUES (%s, %s, %s, %s)
                    """
                    # Convert data to a list of tuples
                    values = [
                        (
                            record.get('name'),
                            record.get('username'),
                            record.get('password'),
                            record.get('status'),
                        )
                        for record in data
                    ]
                    cursor.executemany(sql, values)
                elif isinstance(data, dict):
                    # Data is a single record
                    sql = """
                    INSERT INTO employee 
                    (name, username, password, status) 
                    VALUES (%s, %s, %s, %s)
                    """
                    values = (
                        data.get('name'),
                        data.get('username'),
                        data.get('password'),
                        data.get('status')
                    )
                    cursor.execute(sql, values)
                else:
                    return jsonify({'error': 'Input data should be a list of records or a single record'}), 400

                conn.commit()
                return jsonify({'message': 'Records inserted successfully'})
            except Error as e:
                conn.rollback()  # Rollback in case of error
                print('Error inserting records:', e)
                return jsonify({'error': 'Failed to insert records'}), 500
            finally:
                cursor.close()
                conn.close()
                print('MySQL connection closed')

@app.route('/update_record', methods=['PUT'])
def update_record():
    if request.method == 'PUT':
        # Get data from the request
        data = request.json
        print("Received data for update:", data)  # Print the received data for debugging

        # Connect to MySQL
        conn = connect_to_db()

        if conn:
            cursor = conn.cursor()
            try:
                # Check if data is a list or a single record
                if isinstance(data, list):
                    # Data is a list of records
                    sql = """
                    UPDATE employee 
                    SET name = %s, username = %s, password = %s, status = %s 
                    WHERE id = %s
                    """
                    # Convert data to a list of tuples
                    values = [
                        (
                            record.get('name'),
                            record.get('username'),
                            record.get('password'),
                            record.get('status'),
                            record.get('id')
                        )
                        for record in data
                    ]
                    cursor.executemany(sql, values)
                elif isinstance(data, dict):
                    # Data is a single record
                    sql = """
                    UPDATE employee 
                    SET name = %s, username = %s, password = %s, status = %s 
                    WHERE id = %s
                    """
                    values = (
                        data.get('name'),
                        data.get('username'),
                        data.get('password'),
                        data.get('status'),
                        data.get('id')
                    )
                    cursor.execute(sql, values)
                else:
                    return jsonify({'error': 'Input data should be a list of records or a single record'}), 400

                conn.commit()
                return jsonify({'message': 'Records updated successfully'})
            except Error as e:
                conn.rollback()  # Rollback in case of error
                print('Error updating records:', e)
                return jsonify({'error': 'Failed to update records'}), 500
            finally:
                cursor.close()
                conn.close()
                print('MySQL connection closed')

if __name__ == '__main__':
    app.run(debug=True)
