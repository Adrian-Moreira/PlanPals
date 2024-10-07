class Urls {
  static const String baseUrl = 'https:localhost';
  
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
  static const String users = '$baseUrl/users';
}


class ErrorMessage {

  // Travel planner Error Messages
  static const String nullTravelPlanner = "No Travel Planner Available.";

}

class EndPoints {
  static const travelPlanner = '/planner';
}