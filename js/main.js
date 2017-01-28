var $ = require("jquery");
$(function(){
  var $body = $("body");
  // build template of all possible wins with filler, 3 in row by 8 possible wins
  var boardPositions = "*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*";
  // convert board template to array
  var boardArray = boardPositions.split(",");
  // variable to reference HTML for each square
  var $squareElement = $body.find("[data-js='square']");
  // variable to reference RESET button
  var $buttonElement = $body.find("[data-js='resetButton']");
  // variable to reference SCORE area
  var $scoreElement = $body.find("[data-js='scoreArea']");
  // set score variables to 0
  var xScore = 0;
  var oScore = 0;
  // first player to go is X
  var player = "x";
  // set variable for winner
  var winningPlayer = "";
  // variable to store a win if found
  var check = "";
  // variable flag to reset board if game over
  var needReset = false;
  // object map of board in vertical format (converts 1-9 to 10-18)
  var verticalBoard = {
    1: 10, 2: 13, 3: 16, 4: 11, 5: 14, 6: 17, 7: 12, 8: 15, 9: 18
  }
  // object map of board in diagonal top left to bottom right format
  // conversion for positions 19 through 21
  var diagonalLeftBoard = {
    1: 19, 5: 20, 9: 21, 2: "", 4: "", 6: "", 8: ""
  }
  // object map of board in diagonal top right to bottom left format
  // conversion for positions 22 through 24
  var diagonalRightBoard = {
    3: 22, 5: 23, 7: 24, 1: "", 2: "", 4: "", 6: "", 8: "", 9: ""
  }
  // object map to convert all possible wins 1 - 24 back to normal 1 - 9 positions
  var reverseBoard = {
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 1, 11: 4, 12: 7, 13: 2, 14: 5, 15: 8,16: 3,
    17: 6, 18: 9, 19: 1, 20: 5, 21: 9, 22: 3, 23: 5, 24: 7
  }
  //--------------------------------------------------------------------------------------
  // function to clear and reset board when game over
  function boardReset(){
    // reset flag to reset board
    needReset = false;
    // loop through all 24 positions of object map
    for (var i = 0; i<24; i++){
      // filling board array with * instead of an X or O
      boardArray[i] = "*"
    }
    // loop through all 9 HTML squares to make them empty
    for (var i = 1; i<10; i++){
      // building the HTML alt reference based on value of i iterator
      var winArray = "[alt='"+i+"']";
      // finding HTML element based on alt value
      var $highlightElement=$body.find(winArray);
      // setting class of square back to empty and text content to null
      $highlightElement.attr({class: "square"});
      $highlightElement.text("");
    }
  }
  // display 0 score at start of game in score HTML element
  $scoreElement.text("Score: X=0 / O=0");
  //++++++++++++++++ click event for squares ++++++++++++++++++++++++++++++++
  $squareElement.on("click", function(){
    // check to make sure game is not over
    if (needReset===false){
      // get HTML element that was clicked
      var $clickedElement = $(this);
      // get the alt value of HTML element clicked
      var alt = $clickedElement.attr("alt");
      // adjust value of alt to match array
      var position = alt-1;
      // ensure the square clicked is empty (contains *, not X or O)
      if (boardArray[position]==="*"){
        // add class to HTML element clicked to show player symbol X or O
        $clickedElement.addClass("square--"+player);
        // add player symbol to array of board
        boardArray[position] = player;
        // need to add square clicked to the "vertical" object map of board
        var newnum = verticalBoard[alt];
        if (newnum!=""){boardArray[newnum-1] = player;}
        // need to add square clicked to the diagonal "top left to bottom right" object map of board
        var newnum = diagonalLeftBoard[alt];
        if (newnum!=""){boardArray[newnum-1] = player;}
        // need to add square clicked to the diagonal "top right to bottom left" object map of board
        var newnum = diagonalRightBoard[alt];
        if (newnum!=""){boardArray[newnum-1] = player;}
        // after player moves, swap player's turn
        if (player==="x"){
          player="o";
        }else{
          player="x"
        }
      }
      // create one large string containing all values of array
      var string = boardArray.join("");
      // loop through all values of large string containing array, three at a time
      for (var i = 0; i<25 ; i+=3){
        // need to grab 3 values at a time to find 3 in a row
        var x = i+3;
        // need to adjust position of i plus one
        var y = i+1;
        // grab 3 values of long string
        check = string.substring(i,x);
        // test if 3 values of check is a win by either symbol
        if (check === "xxx" || check === "ooo"){
          // get one value of 3 in a row to see which is winner
          winningPlayer = check.substring(0,1);
          //----------------------------------------------------------------------------------------
          // convert the position of first of 3 in a row in large string back to a 9 square board
          var winPosition = reverseBoard[y];
          // build the HTML alt segment based on first of 3 in a row
          var winHTML = "[alt='"+winPosition+"']";
          // locate which HTML element contains part of the 3 in a row using alt HTML
          var $highlightElement=$body.find(winHTML);
          // add class for winning square to highlight bold in red
          $highlightElement.addClass("square--won");
          //----------------------------------------------------------------------------------------
          // convert the position of second of 3 in a row in large string back to a 9 square board
          var winPosition = reverseBoard[y+1];
          // build the HTML alt segment based on second of 3 in a row
          var winHTML = "[alt='"+winPosition+"']";
          // locate which HTML element contains part of the 3 in a row using alt HTML
          var $highlightElement=$body.find(winHTML);
          // add class for winning square to highlight bold in red
          $highlightElement.addClass("square--won");
          //--------------------------------------------------------------------------------------
          // convert the position of third of 3 in a row in large string back to a 9 square board
          var winPosition = reverseBoard[y+2];
          // build the HTML alt segment based on third of 3 in a row
          var winHTML = "[alt='"+winPosition+"']";
          // locate which HTML element contains part of the 3 in a row using the alt HTML
          var $highlightElement=$body.find(winHTML);
          // add class for winning square to highlight bold in red
          $highlightElement.addClass("square--won");
          //--------------------------------------------------------------------------------------
          // a winner was found, so need to reset for new game
          needReset = true;
          // if x wins, then find all o's to fade opacity....
          if (winningPlayer === "x"){
            // loop through all square to find O's
            for (var j = 0; j < 10; j++){
              if (boardArray[j]==="o"){
                // adjust value of array pointer to match element alt values
                jj = j+1;
                // build HTML of alt values to find loser squares
                var lostHTML = "[alt='"+jj+"']";
                var $highlightElement=$body.find(lostHTML);
                // add class to loser square to change opacity
                $highlightElement.addClass("square--lost");
              }
            }
            // update score
            xScore++;
            // reset for new game
            check = "";
            winningPlayer = "";
          }
          // if o wins, then find all x's to fade opacity....
          if (winningPlayer === "o"){
            // loop through all square to find X's
            for (var j = 0; j < 10; j++){
              if (boardArray[j]==="x"){
                // adjust value of array pointer to match element alt values
                jj = j+1;
                // build HTML of alt values to find loser squares
                var winHTML = "[alt='"+jj+"']";
                var $highlightElement=$body.find(winHTML);
                // add class to loser square to change opacity
                $highlightElement.addClass("square--lost");
              }
            }
            // update score
            oScore++;
            // reset for new game
            check = "";
            winningPlayer = "";
          }
        }
        // update scores in score HTML element
        $scoreElement.text("Score: X="+xScore+" / O="+oScore);
      }
    }
    // call function to reset board for new game if button clicked
    $buttonElement.on("click", function(){
      boardReset();
    });
  });
})
