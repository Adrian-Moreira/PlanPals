import 'package:planpals/features/travel_planner/models/travel_planner_model.dart';

class TravelPlannerList {
  final List<TravelPlanner> travelPlanners;

  TravelPlannerList({
    required this.travelPlanners, 
  });

  // Convert the TravelPlannerList to JSON format
  Map<String, dynamic> toJson() {
    return {
      'travelPlanners': travelPlanners.map((planner) => planner.toJson()).toList(),
    };
  }

  // Factory constructor to create TravelPlannerList from JSON
  factory TravelPlannerList.fromJson(Map<String, dynamic> json) {
    List<TravelPlanner> planners = (json['planners'] as List)
        .map((plannerJson) => TravelPlanner.fromJson(plannerJson))
        .toList();

    return TravelPlannerList(
      travelPlanners: planners,
    );
  }


  // Add a new planner to the list
  void addPlanner(TravelPlanner planner) {
    travelPlanners.add(planner);
  }

  // GETTERS
  get length => null;

  TravelPlanner getTravelPlannerByIndex(int index) {
    if (index < 0 || index >= travelPlanners.length) {
      throw RangeError('Index out of range');
    }
    return travelPlanners[index];
  }
}