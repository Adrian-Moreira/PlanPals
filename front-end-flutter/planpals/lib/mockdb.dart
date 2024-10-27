import 'package:planpals/features/travel_planner/models/accommodation_model.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';

class MockDatabase {
  
  static List<Accommodation> getAccommodations() {
    return [
      Accommodation(
        accommodationId: "1",
        name: 'Hilton Garden Inn',
        address: '123 Main St, Anytown, USA',
        checkInDate: DateTime.now(),
        checkOutDate: DateTime.now().add(Duration(days: 7)),
        destinationId: "1",
      ),
      Accommodation(
        accommodationId: "2",
        name: 'Marriott International',
        address: '456 Oak St, Anytown, USA',
        checkInDate: DateTime.now(),
        checkOutDate: DateTime.now().add(Duration(days: 7)),
        destinationId: "1",
      ),
      Accommodation(
        accommodationId: "3",
        name: 'Hilton Garden Inn',
        address: '789 Elm St, Anytown, USA',
        checkInDate: DateTime.now(),
        checkOutDate: DateTime.now().add(Duration(days: 7)),
        destinationId: "1",
      ),
    ];
  }

  static List<Activity> getActivities() {
    return [
      Activity(
        activityId: "1",
        name: 'Hiking',
        date: DateTime.now(),
        destinationId: "1",
        duration: 1,
        locations: [],
        votes: [],
        comments: [],
      ),
      Activity(
        activityId: "2",
        name: 'Camping',
        date: DateTime.now(),
        destinationId: "1",
        duration: 1,
        locations: [],
        votes: [],
        comments: [],
      ),
      Activity(
        activityId: "3",
        name: 'Hiking',
        date: DateTime.now(),
        destinationId: "1",
        duration: 1,
        locations: [],
        votes: [],
        comments: [],
      ),
    ];
  }
}