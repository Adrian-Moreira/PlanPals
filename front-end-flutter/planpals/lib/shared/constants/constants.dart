class Urls {

  // Using AWS server
  // static const String baseUrl = 'http://ec2-54-224-27-60.compute-1.amazonaws.com:8080';

  // Localhost server
  static const String baseUrl = 'http://10.0.2.2:8080';
  
  // Travel planner URLs
  static const String travelPlanner = '$baseUrl/planner';
  static const String flights = '$baseUrl/planner/flights';
  static const String accommodations = '$baseUrl/planner/accommodations';
  static const String activities = '$baseUrl/planner/activities';

  // Shopping list URLs
  static const String shoppingList = '$baseUrl/shoppinglist';
  
  // To-do list URLs
  static const String todoList = '$baseUrl/todolist';

  // Users
  static const String users = '$baseUrl/user';
}


class ErrorMessage {

  // Travel planner Error Messages
  static const String nullTravelPlanner = "No Travel Planner Available.";

  static var nullPlanner = "No Travel Planner Available.";

  static var nullUser;

}

class EndPoints {
  static const travelPlanner = '/planner';
}

class Routes {
  // Home
  static const home = '/';

  // Travel Planner List
  static const travelPlanner = '/travelPlanner';

  //Profile
  static const profile = '/profile';
}