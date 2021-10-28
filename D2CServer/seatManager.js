function constructSeatLayout(bookedSeats, seatCount, columns){
    const layout = []
    for(var i=0; i<Math.ceil(seatCount/columns); i++){
        row = [];
        for(var j=0; j<columns; j++){
            row.push('');
        }
        layout.push(row);
    }
    bookedSeats.forEach(element => {
        const cellNumber = element-1;
        layout[Math.floor(cellNumber/columns)][cellNumber%columns] = 'x';
    });

    for(var i=seatCount; i<columns*layout.length; i++){
        layout[Math.floor(i/columns)][i%columns] = 'x';
    }
    return layout;
}

function getEmptySeats(layout){
    const emptySeats = [];
    for(var i = 0; i<layout.length; i++){
        const row = layout[i];
        for(var j=0; j<row.length; j++){
            if(layout[i][j] == ''){
                emptySeats.push(i*j);
            }
        }
    }
    return emptySeats;
}

function getSeatsToBook(seatsCount, layout){
    const columns = layout[0].length;
    const total_empty_spans = []
    for(var i=0; i<layout.length; i++){
        const row = layout[i];
        let empty_spans = [[]];
        for(var j=0; j<row.length; j++){
            if(row[j] == 'x'){
                empty_spans.push([])
            }
            else{
                empty_spans[empty_spans.length-1].push(j);
            }
        }
        empty_spans = empty_spans.filter(span => span.length > 0)
        // for(var j=0; j<empty_spans.length; j++){
        //     const span = empty_spans[j];
        //     if(span.length >= seatsCount){
        //         return span.slice(0, seatsCount);
        //     }
        // }
        total_empty_spans.push(empty_spans);
    }
    
    const spans_by_length = {}
    for(var i=0; i<layout[0].length; i++){
        spans_by_length[i+1] = []
    }

    for(var i=0; i<layout.length; i++){
        const spans = total_empty_spans[i];
        for(var j=0; j<spans.length; j++){
            spans_by_length[spans[j].length].push([i,j])
        }
    }

    for(var i=seatsCount; i<=layout[0].length; i++){
        if(spans_by_length[i].length > 0){
            const first_span = spans_by_length[i][0];
            return total_empty_spans[first_span[0]][first_span[1]].slice(0,seatsCount).map(each=>(first_span[0]*columns)+each);
        }
    }

    let seatsRemaining = seatsCount;
    const blockedSeats = []
    const priorityOrder = [];
    for(var i=seatsCount-1; i>0; i--){
        if(spans_by_length[i].length > 0){
            const first_span = spans_by_length[i][0];
            blockedSeats.push(...total_empty_spans[first_span[0]][first_span[1]].map(each=>first_span[0]*columns+each));
            total_empty_spans[first_span[0]].splice(first_span[1],1)
            spans_by_length[i].splice(0,1)
            seatsRemaining -= i;
            const rowNum = first_span[0]
            priorityOrder.push(rowNum)
            let a = rowNum - 1;
            let b = rowNum + 1;
            while(priorityOrder.length < layout.length){
                if(a >= 0){
                    priorityOrder.push(a);
                }
                if(b <= layout.length){
                    priorityOrder.push(b);
                }
                a--;
                b++;
            }
            for(var k=0; k<priorityOrder.length; k++){
                const row = priorityOrder[k];
                const spans = total_empty_spans[row];
                for(var j=0; j<spans.length; j++){
                    let maxSeats = spans[j].length;
                    if(maxSeats <= seatsRemaining){
                        blockedSeats.push(...spans[j].map(each=>row*columns+each));
                        seatsRemaining -= maxSeats;
                    }
                    else{
                        blockedSeats.push(...spans[j].slice(0,seatsRemaining).map(each=>row*columns+each))
                        seatsRemaining = 0;
                        break;
                    }
                }
                if(seatsRemaining == 0){
                    break;
                }
            }
            
            break;
        }
    }
    return blockedSeats;
}

exports.constructSeatLayout = constructSeatLayout;
exports.getSeatsToBook = getSeatsToBook;
exports.getEmptySeats = getEmptySeats;