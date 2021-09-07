class Equation{
    constructor(equation_str){
        this.equation_str = equation_str;
        this.add_plus(equation_str);
        this.equation_str = this.equation_str.replace(/\s/g, '');
        const splits = this.equation_str.split('=');
        if (splits.length != 2){
            throw `The equation must have two sides separated by =`;
        }else{
            this.rhs = new Polynomial(splits[0]);
            this.lhs = new Polynomial(splits[1]);
            this.rhs.coeff.sort((a, b) => a.key - b.key);
            this.lhs.coeff.sort((a, b) => a.key - b.key);
        }
        this.equ = this.process_polynomes();
        return;
        if (this.check_equation_degree() === true)
        {
            this.a = this.rhs.a - this.lhs.a;
            this.b = this.rhs.b - this.lhs.b;
            this.c = this.rhs.c - this.lhs.c;
            this.print_equation();
            this.solve_equation();
        }
    }

    process_polynomes(){
        let result = [];
        for (let index = 0; index < this.rhs.coeff.length; index++) {
            const element = this.rhs.coeff[index];
            const index2 = this.lhs.coeff.findIndex(elem => elem.key === element.key);
            if (index2 === -1){
                result.push(element);
            }else{
                console.log('Before ', this.lhs.coeff);
                const monome = {key: element.key, value : this.rhs.coeff[index].value - this.lhs.coeff[index2].value}
                result.push(monome);
                this.lhs.coeff.splice(index2, 1);
                console.log('After ', this.lhs.coeff);
            }
        }
        for (let index = 0; index < this.lhs.coeff.length; index++){
            result.push(this.lhs.coeff[index])
        }
        console.log(result);
        return result;
    }

    check_equation_degree(){
        let checker = [];
        let mismatch = false;
        for (let index = 0; index < this.rhs.extracoeff.length; index++) {
            const element = this.rhs.extracoeff[index];
            if (this.lhs.extracoeff.includes(element)){
                if ((this.rhs.extracoeff[element.key].value - this.lhs.extracoeff[element.key].value) !== 0){
                    console.log(this.rhs.extracoeff);
                    checker.push(element.key);
                }
            }else{
                mismatch = true;
                break;
            }
        }
        if (mismatch || checker.length > 0){
            let exponent;

            if (mismatch){
                this.rhs.extracoeff.sort((a, b) => a.key - b.key);
                this.lhs.extracoeff.sort((a, b) => a.key - b.key);
                if (!this.lhs.extracoeff[0]){
                    exponent = this.rhs.extracoeff[0].key;
                }else if (!this.rhs.extracoeff[0]){
                    exponent = this.lhs.extracoeff[0].key;
                }else{
                    exponent = Math.max(this.rhs.extracoeff[0].key, this.lhs.extracoeff[0].key);
                }
            }else{
                checker.sort((a, b) => a - b);
                exponent = checker[0];
            }
            let errorMsg  = `Polynomial degree: ${exponent}\n`;
            if (exponent > '2'){
                errorMsg += `The polynomial degree is strictly greater than 2, I can't solve.`;
            }else{
                errorMsg += `The polynomial degree is strictly less than 0, I can't solve.`;
            }
            console.log(errorMsg);
            return false;
        }
        return true;
    }
    
    solve_equation(){
        if (this.a === 0){
            if (this.b === 0){
                if (this.c === 0){
                    this.print_any_solution();
                }else{
                    this.print_no_solution();
                }
            }
           else
            {
                let s = -this.c / this.b;
                this.print_one_solution(s);
            }
        }else{
            let delta = this.b * this.b - 4 * this.a * this.c;
            if (delta < 0){
                this.print_no_solution();
            }else if (delta === 0){
                let s = -this.b / (2 * this.a);
                this.print_one_solution(s);
            }else{
                let s1, s2;
                delta = Math.sqrt(delta);
                s1 = (-this.b - delta) / ( 2 * this.a);
                s2 = (-this.b + delta) / (2 * this.a);
                this.print_two_solutions(s1, s2);
            }
        }
    }

    print_no_solution(){
        console.log(`no solution`);
    }

    print_one_solution(s){
        console.log(`The solution is:`);
        console.log(s);
    }

    print_two_solutions(s1, s2){
        console.log(`Discriminant is strictly positive, the two solutions are:`);
        console.log(s1);
        console.log(s2);
    }

    print_any_solution(){
        console.log(`Any number as solution`);
    }

    print_equation(){
        let v_eq = '';
        let degree = 0;

        if (this.c !== 0){
            v_eq += `${this.c}`;
        }
        if (this.b !== 0){
            degree = 1;
            v_eq += (v_eq ? (this.b > 0 ? ' + ' : ' - ' ): v_eq ) + `${Math.abs(this.b)} * X `; 
        }
        if (this.a !== 0){
            v_eq += (v_eq ? (this.a > 0 ? ' + ' : ' - ' ): v_eq ) + `${Math.abs(this.a)} * X ^ 2`;
            degree = 2;
        }
        v_eq = v_eq !== '' ? v_eq + ' = 0':'';
        console.log(`Reduced form: ${v_eq}`);
        console.log(`Polynomial degree: ${degree}`);
    }

    add_plus(equation_str){
        this.equation_str = equation_str.replace(/\-/g, '+-');
    }
}

class Polynomial{
    constructor(polynomial_str){
        this.polynomial_str = polynomial_str;
        this.coeff = [];
        try{
            this.parse();
        }catch(err){ console.log(err);}
    }

    parse_ab(a_monome_str){
        let n = a_monome_str.indexOf('X');
        if (n === 0){
            a_monome_str = '1'+a_monome_str.substring(n);
        }else if (n === 1 && a_monome_str[0] === '-'){
            a_monome_str = a_monome_str.substring(0,n)+'1'+a_monome_str.substring(n);
        }
        return parseFloat(a_monome_str);
    }

    parse(){
        const re = '+';
        const splites = this.polynomial_str.split(re);
        splites.forEach(split => {
            if (split.length === 0 || !split.trim()){
               return false;
            }
            let exponent = parseInt(split.split('^')[1], 10);
            if (isNaN(exponent)){
                if (split.includes('X') === false){
                    split = split + 'X^0';
                    exponent = 0;
                }else{
                    split = split + 'X^1';
                    exponent = 1;
                }
            }
            {
                let coefIndex = this.coeff.findIndex(coef => coef.key === exponent);
                if (coefIndex === -1){
                    this.coeff.push({key:exponent, value: this.parse_ab(split)});
                }else{
                    this.coeff[coefIndex].value += this.parse_ab(split);
                }
            }
        });
        console.log(this.coeff);
        return true;
    }
}

if (process.argv.length == 3){
    const equation = new Equation(process.argv[2]);
}else{
    console.log(`Usage: node index.js "5 + 4 * X + X^2 = X^2"`);
}
