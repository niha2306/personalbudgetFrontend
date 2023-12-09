import { useEffect } from "react";

const Home = () => {

    useEffect(() => {

    }, [])
    return (
        <div className="homePageBackground">
            <div className="container">
                <h2>Budget</h2>
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#myModal">
                    Add Budget
                </button>

                <div class="container mt-5">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Age</th>
          <th scope="col">City</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>John Doe</td>
          <td>25</td>
          <td>New York</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Jane Doe</td>
          <td>30</td>
          <td>Los Angeles</td>
        </tr>
      </tbody>
    </table>
  </div>
            </div>

            <div className="modal" id="myModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Add Project</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label for="title">Title:</label>
                                    <input type="text" className="form-control" id="title" />
                                </div>
                                <div className="form-group">
                                    <label for="budget">Budget:</label>
                                    <input type="text" className="form-control" id="budget" />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-success">Add Project</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;