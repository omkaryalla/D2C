const {constructSeatLayout, getSeatsToBook} = require("./seatManager")

layout = constructSeatLayout([], 80, 7)

function print(l){
    for(var i=0; i<l.length; i++){
        const temp = [];
        for(var j=0; j<l[i].length; j++){
            let num = i*l[0].length + j + 1
            if(l[i][j] == 'x'){
                temp.push('⬜')
            }
            else if(l[i][j] == 'y'){
                temp.push('🎌');
            }
            else{
                temp.push(num);
            }
        }
        console.log(temp.join(" "));
    }
    console.log("\n\n");
}

function blockSeats(e){
    e.forEach(a => {
        layout[Math.floor(a/layout[0].length)][a%layout[0].length] = 'y'
    });
    print(layout)
    e.forEach(a => {
        layout[Math.floor(a/layout[0].length)][a%layout[0].length] = 'x'
    });
}

print(layout)

layout[0][0] = 'x'
layout[0][3] = 'x'
layout[1][3] = 'x'
layout[0][3] = 'x'
layout[4][3] = 'x'
layout[0][3] = 'x'
layout[7][5] = 'x'
layout[11][2] = 'x'

print(layout)

temp = getSeatsToBook(4, layout)
blockSeats(temp)

temp = getSeatsToBook(7, layout)
blockSeats(temp)

temp = getSeatsToBook(2, layout)
blockSeats(temp)

temp = getSeatsToBook(6, layout)
blockSeats(temp)

temp = getSeatsToBook(5, layout)
blockSeats(temp)

temp = getSeatsToBook(7, layout)
blockSeats(temp)

temp = getSeatsToBook(2, layout)
blockSeats(temp)

temp = getSeatsToBook(6, layout)
blockSeats(temp)

temp = getSeatsToBook(5, layout)
blockSeats(temp)

temp = getSeatsToBook(2, layout)
blockSeats(temp)

temp = getSeatsToBook(6, layout)
blockSeats(temp)

temp = getSeatsToBook(5, layout)
blockSeats(temp)

temp = getSeatsToBook(1, layout)
blockSeats(temp)

temp = getSeatsToBook(2, layout)
blockSeats(temp)

temp = getSeatsToBook(4, layout)
blockSeats(temp)

temp = getSeatsToBook(5, layout)
blockSeats(temp)

temp = getSeatsToBook(2, layout)
blockSeats(temp)

temp = getSeatsToBook(2, layout)
blockSeats(temp)

temp = getSeatsToBook(1, layout)
blockSeats(temp)