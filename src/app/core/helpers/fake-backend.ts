import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { CandidateList, JobApplydata, JobGriddata, JobListdata, chatData, chatMessagesData, customersData, emailData, listData, orders, ordersData, projectData, recentFiles, tasks, userGridData, userList } from '../data';
import { cartData } from '../data';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // array in local storage for registered users
        // tslint:disable-next-line: max-line-length
        const users: any[] = JSON.parse(localStorage.getItem('users')!) || [{ username: 'admin', email: 'admin@themesbrand.com', password: '123456' }];

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                const filteredUsers = users.filter(user => {
                    return user.email === request.body.email && user.password === request.body.password;
                });
                if (filteredUsers.length) {
                    // if login details are valid return 200 OK with user details and fake jwt token
                    const user = filteredUsers[0];
                    const body = {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token: 'fake-jwt-token'
                    };

                    return of(new HttpResponse({ status: 200, body }));
                } else {
                    // else return 400 bad request
                    return throwError({ error: { message: 'Username or password is incorrect' } });
                }
            }

            // get users
            if (request.url.endsWith('/users') && request.method === 'GET') {
                // tslint:disable-next-line: max-line-length
                // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                // if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                return of(new HttpResponse({ status: 200, body: users }));
                // } else {
                // return 401 not authorised if token is null or invalid
                // return throwError({ status: 401, error: { message: 'Unauthorised' } });
                // }
            }

            // get user by id
            if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
                // tslint:disable-next-line: max-line-length
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    const urlParts = request.url.split('/');
                    // tslint:disable-next-line: radix
                    const id = parseInt(urlParts[urlParts.length - 1]);
                    // tslint:disable-next-line: no-shadowed-variable
                    const matchedUsers = users.filter(user => user.id === id);
                    const user = matchedUsers.length ? matchedUsers[0] : null;

                    return of(new HttpResponse({ status: 200, body: user }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // register user
            if (request.url.endsWith('/users/register') && request.method === 'POST') {
                // get new user object from post body
                const newUser = request.body;
                // validation
                const duplicateUser = users.filter(user => user.username === newUser.username).length;
                if (duplicateUser) {
                    return throwError({ error: { message: 'Username "' + newUser.username + '" is already taken' } });
                }

                // save new user
                newUser.id = users.length + 1;
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                // respond 200 OK
                return of(new HttpResponse({ status: 200 }));
            }

            // delete user
            if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
                // tslint:disable-next-line: max-line-length
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    const urlParts = request.url.split('/');
                    // tslint:disable-next-line: radix
                    const id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < users.length; i++) {
                        const user = users[i];
                        if (user.id === id) {
                            // delete user
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    // respond 200 OK
                    return of(new HttpResponse({ status: 200 }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // get recentFiles
            if (request.url.endsWith('/app/recentFiles') && request.method === 'GET') {
                if (recentFiles) {
                    return of(new HttpResponse({ status: 200, body: recentFiles }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }

            // get Orderdata
            if (request.url.endsWith('/app/orderData') && request.method === 'GET') {
                if (ordersData) {
                    return of(new HttpResponse({ status: 200, body: ordersData }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }


            // Add Orderdata
            if (request.url.endsWith('/app/orderData') && request.method === 'POST') {
                const newUser = request.body;
                if (ordersData) {
                    return of(new HttpResponse({ status: 200, body: newUser }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }

            // Update Orderdata
            if (request.url.endsWith('/app/orderData') && request.method === 'PUT') {
                const updatedUser = request.body;
                if (ordersData) {
                    return of(new HttpResponse({ status: 200, body: updatedUser }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }

            // delete Orderdata
            if (request.url.endsWith('/app/orderData') && request.method === 'DELETE') {
                const updatedUser = request.body;
                if (ordersData) {
                    return of(new HttpResponse({ status: 200, body: updatedUser })); // respond 200 OK
                } else {
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }


            // get cart
            if (request.url.endsWith('/app/cart') && request.method === 'GET') {
                if (cartData) {
                    return of(new HttpResponse({ status: 200, body: cartData }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }

            // get projects
            if (request.url.endsWith('/app/projects') && request.method === 'GET') {
                if (projectData) {
                    return of(new HttpResponse({ status: 200, body: projectData }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }

            // get userGridData
            if (request.url.endsWith('/app/userGrid') && request.method === 'GET') {
                if (userGridData) {
                    return of(new HttpResponse({ status: 200, body: userGridData }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }

            // get userGridData
            if (request.url.endsWith('/app/userlist') && request.method === 'GET') {
                if (userList) {
                    return of(new HttpResponse({ status: 200, body: userList }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }


            // Add userlist
            if (request.url.endsWith('/app/userlist') && request.method === 'POST') {
                const newUser = request.body;
                if (userList) {
                    return of(new HttpResponse({ status: 200, body: newUser }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }

            // Update userlist
            if (request.url.endsWith('/app/userlist') && request.method === 'PUT') {
                const updatedUser = request.body;
                if (userList) {
                    return of(new HttpResponse({ status: 200, body: updatedUser }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }

            // delete userlist
            if (request.url.endsWith('/app/userlist') && request.method === 'DELETE') {
                const updatedUser = request.body;
                if (userList) {
                    return of(new HttpResponse({ status: 200, body: updatedUser })); // respond 200 OK
                } else {
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }


            // get joblist
            if (request.url.endsWith('/app/joblist') && request.method === 'GET') {
                if (JobListdata) {
                    return of(new HttpResponse({ status: 200, body: JobListdata }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }

            // Add joblist
            if (request.url.endsWith('/app/joblist') && request.method === 'POST') {
                const newUser = request.body;
                if (JobListdata) {
                    return of(new HttpResponse({ status: 200, body: newUser }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }

            // Update joblist
            if (request.url.endsWith('/app/joblist') && request.method === 'PUT') {
                const updatedUser = request.body;
                if (JobListdata) {
                    return of(new HttpResponse({ status: 200, body: updatedUser }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }
            // delete joblist
            if (request.url.endsWith('/app/joblist') && request.method === 'DELETE') {
                const updatedUser = request.body;
                if (JobListdata) {
                    return of(new HttpResponse({ status: 200, body: updatedUser })); // respond 200 OK
                } else {
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // get joblist
            if (request.url.endsWith('/app/jobgrid') && request.method === 'GET') {
                if (JobGriddata) {
                    return of(new HttpResponse({ status: 200, body: JobGriddata }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }

            // get joblist
            if (request.url.endsWith('/app/jobapply') && request.method === 'GET') {
                if (JobApplydata) {
                    return of(new HttpResponse({ status: 200, body: JobApplydata }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }

            // get candidates
            if (request.url.endsWith('/app/candidate') && request.method === 'GET') {
                if (CandidateList) {
                    return of(new HttpResponse({ status: 200, body: CandidateList }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }
            // get invoice
            if (request.url.endsWith('/app/invoice') && request.method === 'GET') {
                if (listData) {
                    return of(new HttpResponse({ status: 200, body: listData }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }
            // get chat
            if (request.url.endsWith('/app/chat') && request.method === 'GET') {
                if (chatData) {
                    return of(new HttpResponse({ status: 200, body: chatData }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }
            // get chatmessage
            if (request.url.endsWith('/app/chatMessage') && request.method === 'GET') {
                if (chatMessagesData) {
                    return of(new HttpResponse({ status: 200, body: chatMessagesData }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }
            // get Tasks
            if (request.url.endsWith('/app/tasks') && request.method === 'GET') {
                if (tasks) {
                    return of(new HttpResponse({ status: 200, body: tasks }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }

            // Add Tasks
            if (request.url.endsWith('/app/tasks') && request.method === 'POST') {
                const newUser = request.body;
                if (tasks) {
                    return of(new HttpResponse({ status: 200, body: newUser }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }
            // Update Tasks
            if (request.url.endsWith('/app/tasks') && request.method === 'PUT') {
                const updatedUser = request.body;
                if (tasks) {
                    return of(new HttpResponse({ status: 200, body: updatedUser }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }
            // get chatmessage
            if (request.url.endsWith('/app/cryto') && request.method === 'GET') {
                if (orders) {
                    return of(new HttpResponse({ status: 200, body: orders }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }
            // get userGridData
            if (request.url.endsWith('/app/customersData') && request.method === 'GET') {
                if (customersData) {
                    return of(new HttpResponse({ status: 200, body: customersData }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }
            // Add Tasks
            if (request.url.endsWith('/app/customersData') && request.method === 'POST') {
                const newUser = request.body;
                if (customersData) {
                    return of(new HttpResponse({ status: 200, body: newUser }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }
            // Update Tasks
            if (request.url.endsWith('/app/customersData') && request.method === 'PUT') {
                const updatedUser = request.body;
                if (customersData) {
                    return of(new HttpResponse({ status: 200, body: updatedUser }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }

            // get chatmessage
            if (request.url.endsWith('/app/emailData') && request.method === 'GET') {
                if (emailData) {
                    return of(new HttpResponse({ status: 200, body: emailData }));
                } else {
                    return throwError({ status: 401, error: { message: 'No Data Found' } });
                }
            }
            // pass through any requests not handled above
            return next.handle(request);

        }))

            // tslint:disable-next-line: max-line-length
            // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());
    }
}
